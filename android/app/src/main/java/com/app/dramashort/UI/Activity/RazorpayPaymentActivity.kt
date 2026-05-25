package com.app.dramashort.UI.Activity

import android.app.Activity
import android.app.AlertDialog
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Model.CreatePaymentRequest
import com.app.dramashort.Model.CreateRazorPayCreateOrderRequest
import com.app.dramashort.Model.CreateRazorPayCreateOrderResponse
import com.app.dramashort.Model.PaymentUpdateRequest
import com.razorpay.*
import org.json.JSONObject
import java.lang.Exception
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityPaymentBinding
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.getValue

@AndroidEntryPoint
class RazorpayPaymentActivity : BaseActivity(), PaymentResultWithDataListener,
    ExternalWalletListener, DialogInterface.OnClickListener {
    val TAG: String = RazorpayPaymentActivity::class.toString()

    var transactionId: String? = null


    val viewModel: UserViewModel by viewModels()
    private lateinit var alertDialogBuilder: AlertDialog.Builder

    lateinit var binding: ActivityPaymentBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPaymentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnBack.setOnClickListener {
            onBackPressed()
        }

        Checkout.preload(applicationContext)
        alertDialogBuilder = AlertDialog.Builder(this@RazorpayPaymentActivity)
        alertDialogBuilder.setTitle("Payment Result")
        alertDialogBuilder.setCancelable(true)
        alertDialogBuilder.setPositiveButton("Ok", this)
        callApi()
    }


    private fun callApi() {

        val planId = intent.getStringExtra(CommonsKt.PLAN_ID_EXTRA)
        val paymentGetwayId = intent.getStringExtra(CommonsKt.GETAWAY_ID_EXTRA)!!
        val currency = intent.getStringExtra(CommonsKt.CURRENCY_EXTRA)!!

        planId?.let {
            val request = CreatePaymentRequest(
                planId = planId.toInt(),
                paymentGetwayId = paymentGetwayId.toInt(),
                currency = currency
            )
            viewModel.viewModelScope.launch {
                val result = viewModel.repository.createPayment(request, pref.authToken)
                if (result is ApiResult.Success) {
                    result.data.responseDetails?.let { responseDetails ->
                        fetchPaymentIntent(responseDetails.transactionId.toString())
                    }
                } else if (result is ApiResult.Error) {
                    showToast(result.message)
                }
            }
        } ?: {
            showToast("planId is null")
        }
    }

    override fun onPaymentSuccess(p0: String?, p1: PaymentData?) {
        try {
            alertDialogBuilder.setMessage("Payment Successful : Payment ID: $p0\nPayment Data: ${p1?.data}")
            alertDialogBuilder.show()
            update(transactionId, p1?.paymentId.toString(), 2)

        } catch (e: Exception) {
//            e.printStackTrace()
        }
    }

    override fun onPaymentError(p0: Int, p2: String?, p1: PaymentData?) {
        try {
            alertDialogBuilder.setMessage("Payment Failed : Payment Data: ${p1?.data}")
            alertDialogBuilder.show()
            update(transactionId, p1?.paymentId.toString(), 3)

        } catch (e: Exception) {
        }
    }

    override fun onExternalWalletSelected(p0: String?, p1: PaymentData?) {
        try {
            alertDialogBuilder.setMessage("External wallet was selected : Payment Data: ${p1?.data}")
            alertDialogBuilder.show()


        } catch (e: Exception) {
        }
    }

    override fun onClick(dialog: DialogInterface?, which: Int) {
    }


    private fun fetchPaymentIntent(transactionId: String) {
        this.transactionId = transactionId

        val planId = intent.getStringExtra(CommonsKt.PLAN_ID_EXTRA)
        planId ?: {
            showToast("planId is null")
        }
        val paymentGetwayId = intent.getStringExtra(CommonsKt.GETAWAY_ID_EXTRA)!!
        val request = CreateRazorPayCreateOrderRequest(
            planId = planId?.toInt(),
            paymentGetwayId = paymentGetwayId.toInt(),
        )

        viewModel.viewModelScope.launch {
            val result = viewModel.repository.createRazorPayCreateOrder(request, pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseMessage?.let { responseMessage ->
                    showToast(responseMessage)
                    result.data.responseDetails?.let { responseDetails ->
                        startPayment(responseDetails)
                    }
                }
            } else if (result is ApiResult.Error) {
                showToast(result.message)
            }
        }
    }


    private fun startPayment(responseDetails: CreateRazorPayCreateOrderResponse.ResponseDetails) {
        val activity: Activity = this
        val co = Checkout()
        val apiKey = intent.getStringExtra(CommonsKt.PAYMENT_KEY_EXTRA)
        apiKey?.let {
            co.setKeyID(apiKey)
            try {
                var options = JSONObject()
                options.put("currency", responseDetails.currency)
                options.put("amount", responseDetails.amount)
                co.open(activity, options)

            } catch (e: Exception) {
                Toast.makeText(activity, "Error in payment: " + e.message, Toast.LENGTH_LONG).show()
            }
        }
    }


    private fun update(transactionId: String?, transactionKey: String, status: Int) {
        val request = PaymentUpdateRequest(
            transactionId = transactionId,
            transactionKey = transactionKey,
            status = status
        )
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.setPaymentUpdate(request, pref.authToken)
            if (result is ApiResult.Success) {

                result.data.responseDetails?.let { responseDetails ->
                    setResultOk()
                } ?: {
                    onBackPressed()
                }
            } else if (result is ApiResult.Error) {
                showToast(result.message)
                onBackPressed()
            }
        }
    }

    override fun onBackPressed() {
        val resultIntent = Intent().apply {
            putExtra("isPaymentSuccess", false)
        }
        setResult(RESULT_CANCELED, resultIntent)
        super.onBackPressed()
    }

    fun setResultOk() {
        val resultIntent = Intent().apply {
            putExtra("isPaymentSuccess", true)
        }
        setResult(RESULT_OK, resultIntent)
        super.onBackPressed()
    }
}