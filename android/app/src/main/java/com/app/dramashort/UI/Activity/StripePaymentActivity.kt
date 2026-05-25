package com.app.dramashort.UI.Activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import com.app.dramashort.Model.CreatePaymentRequest
import com.app.dramashort.Model.PaymentUpdateRequest
import com.app.dramashort.Model.StripePaymentIntentRequest
import com.stripe.android.paymentsheet.PaymentSheet
import com.stripe.android.paymentsheet.PaymentSheetResult
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.showToast
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityCheckoutBinding
import com.stripe.android.PaymentConfiguration
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import kotlin.String
import kotlin.getValue

@AndroidEntryPoint
class StripePaymentActivity : BaseActivity() {
    val viewModel: UserViewModel by viewModels()


    private lateinit var paymentSheet: PaymentSheet
    var transactionId: String? = null
    private lateinit var binding: ActivityCheckoutBinding
    private var transactionKey: String = ""


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCheckoutBinding.inflate(layoutInflater)
        setContentView(binding.root)


        binding.btnBack.setOnClickListener {
            onBackPressed()
        }


        callApi()
        paymentSheet = PaymentSheet(this, callback = { paymentResult ->
            onPaymentSheetResult(paymentResult)
        })

    }


    private fun callApi() {
        val apiKey = intent.getStringExtra(CommonsKt.PAYMENT_KEY_EXTRA)
        apiKey?.let {
            PaymentConfiguration.init(applicationContext, apiKey)
        } ?: {
            showToast("apiKey is null")
        }

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
                    onBackPressed()
                }
            }
        } ?: {
            showToast("planId is null")
        }

    }


    private fun fetchPaymentIntent(transactionId: String) {
        this.transactionId = transactionId

        val planId = intent.getStringExtra(CommonsKt.PLAN_ID_EXTRA)
        planId ?: {
            showToast("planId is null")
        }
        Log.e("TAG", "fetchPaymentIntent planId: $planId")

        val request = StripePaymentIntentRequest(
            planId = planId?.toInt(),
            paymentGetwayId = 1,
            transactionId = transactionId,
        )
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.createStripePaymentIntent(request, pref.authToken)
            if (result is ApiResult.Success) {
                result.data.responseMessage?.let { responseMessage ->
                    showToast(responseMessage)
                    result.data.responseDetails?.let { clientSecret ->
                        transactionKey = clientSecret.clientSecret.toString()

                        paymentSheet.presentWithPaymentIntent(
                            clientSecret.clientSecret.toString(),
                            PaymentSheet.Configuration("Demo, Inc.")
                        )
                    }
                }
            } else if (result is ApiResult.Error) {
                showToast(result.message)
                onBackPressed()
            }
        }

    }

    private fun onPaymentSheetResult(paymentResult: PaymentSheetResult) {

        when (paymentResult) {
            is PaymentSheetResult.Completed -> {
                Toast.makeText(this, "Payment complete!", Toast.LENGTH_LONG).show()
                update(transactionId, transactionKey, 2)
            }

            is PaymentSheetResult.Canceled -> {
                Toast.makeText(this, "Payment canceled.", Toast.LENGTH_SHORT).show()
                update(transactionId, transactionKey, 3)

            }

            is PaymentSheetResult.Failed -> {
                update(transactionId, transactionKey, 3)

                Toast.makeText(
                    this,
                    "Payment failed: ${paymentResult.error.localizedMessage}",
                    Toast.LENGTH_LONG
                ).show()
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
        Log.e("StripePaymentActivity", "isPaymentSuccess: onBackPressed")
        setResult(RESULT_CANCELED, resultIntent)
        super.onBackPressed()
    }

    fun setResultOk() {
        val resultIntent = Intent().apply {
            putExtra("isPaymentSuccess", true)
        }
        Log.e("StripePaymentActivity", "isPaymentSuccess: setResultOk")
        setResult(RESULT_OK, resultIntent)
        super.onBackPressed()
    }
}
