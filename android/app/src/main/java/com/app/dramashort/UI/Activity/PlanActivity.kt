package com.app.dramashort.UI.Activity

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.telephony.TelephonyManager
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.lifecycle.viewModelScope
import androidx.recyclerview.widget.GridLayoutManager
import com.android.billingclient.api.ProductDetails
import com.app.dramashort.Dialogs.PaymentOptionBottomSheet
import com.app.dramashort.Dialogs.TagWiseListBottomSheet
import com.app.dramashort.Model.CreatePaymentRequest
import com.app.dramashort.Model.PaymentOptionResponse
import com.app.dramashort.Model.VerifyGooglePlayPaymentRequest
import com.app.dramashort.Premium.BillingManagerConsumePurchase
import com.app.dramashort.Premium.TaskStatus
import com.app.dramashort.R
import com.app.dramashort.UI.Adapter.PlanAdapter
import com.app.dramashort.UI.Adapter.PlanItem
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.createNameBitmap
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.removeCommaAndToFloat
import com.app.dramashort.Utils.showToast
import com.app.dramashort.Utils.visible
import com.app.dramashort.ViewModel.ApiResult
import com.app.dramashort.ViewModel.UserViewModel
import com.app.dramashort.databinding.ActivityPlanListBinding
import com.dramaking.shortreels.Premum.BillingResultState
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import test.app.gallery.UI1.Base.BaseActivity
import java.util.Currency
import kotlin.getValue
import kotlin.text.ifEmpty
import kotlin.text.uppercase

@AndroidEntryPoint
class PlanActivity : BaseActivity() {
    var isVipClick = false
    var isVipPurchased = false
    var isPaymentSuccess = false

    private lateinit var bottomSheet: PaymentOptionBottomSheet
    private var paymentOptionList: List<PaymentOptionResponse.ResponseDetail>? = null
    private var mainPlanAdapter: PlanAdapter? = null

    var paymentLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val isPaymentSuccess = result.data?.getBooleanExtra("isPaymentSuccess", false)!!
            Log.e("PlanActivity", "isPaymentSuccess : $isPaymentSuccess")
            if (isPaymentSuccess) {
                this@PlanActivity.isPaymentSuccess = true
                loadData()
            } else {
//               false()
            }
        } else {
//             false()
        }
    }


    val viewModel: UserViewModel by viewModels()
    lateinit var binding: ActivityPlanListBinding
    private lateinit var billingManager: BillingManagerConsumePurchase
    private var billingList: List<ProductDetails> = emptyList()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlanListBinding.inflate(layoutInflater)
        setContentView(binding.root)

//        loadPlaymentList()

        isPaymentSuccess = false
        binding.onPlayll.setOnClickListener {
//            onBackPressed()
        }
        binding.btnBack.setOnClickListener {
            onBackPressed()
        }

        binding.paymentConstraint.setOnClickListener {
            if (::bottomSheet.isInitialized) {
                bottomSheet.show(supportFragmentManager, TagWiseListBottomSheet.TAG)
            } else {
                showToast("No payment option available")
            }
        }

        binding.btnContinue.setOnClickListener {
            // 1. Get the item from the adapter
            val selectedItem = (binding.plansRecyclerView.adapter as? PlanAdapter)?.getSelectedItem()
            // 2. Check what type it is and proceed
            if (selectedItem != null) {
                if (selectedItem.type == PlanItem.TYPE_SUBSCRIBE) {
                    isVipClick = true
                    if (intent.getBooleanExtra("isVipMember", false) || isVipPurchased) {
                        showToast("You are already a Vip member")
                        return@setOnClickListener
                    }

                    val subscribeData = selectedItem.subscribeData
                    Log.d("TAG", "Selected Subscription: ${subscribeData?.name}")
                    // handleSubscription(plan)
                    actionPayment(
                        subscribeData!!.id.toString(),
                        subscribeData.googlePlayId.toString(),
                        paymentOptionList?.find { it.isSelected },
                        subscribeData.googleCurrency ?: "$",
                        subscribeData.amount

                    )
                } else if (selectedItem.type == PlanItem.TYPE_REFILL) {
                    val refillData = selectedItem.refillData
                    Log.d("TAG", "Selected Coin Pack: ${refillData?.amount}")
                    // handleRefill(coin)
                    actionPayment(
                        refillData!!.id.toString(),
                        refillData.googlePlayId.toString(),
                        paymentOptionList?.find { it.isSelected },
                        refillData.googleCurrency ?: "$",
                        refillData.amount
                    )
                }
            } else {
                Toast.makeText(this, "Please select a plan first", Toast.LENGTH_SHORT).show()
            }
        }

        loadData()
    }

    private fun loadData() {
//        viewModel.getPlanList(pref.authToken)
        showProgress()
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.loadPlanData(pref.authToken)
            if (result is ApiResult.Success) {
                result.data.first.responseDetails?.let { responseDetails ->

                    val countryCode = responseDetails.userLocation?.countryCode

                    result.data.second.responseDetails?.let {
                        loadPlaymentList(it.filterNotNull(), countryCode)
                    }

                    val paymentOptionName = paymentOptionList?.find { it.isSelected }?.name ?: ""


                    Log.e("TAG", "loadData: ")


                    val list = responseDetails.unlimited?.map { it?.googlePlayId ?: "0" }
                    val list1 = responseDetails.limited?.map { it?.googlePlayId ?: "0" }
                    val coinProductIds = (list?.plus(list1 ?: emptyList()) ?: emptyList())

                    billingManager = BillingManagerConsumePurchase(this@PlanActivity, callbackList = { list ->
                        // 1. Process Unlimited (Subscribe) List
                        val unlimitedList = responseDetails.unlimited?.mapNotNull { unlimited ->
                            val product = list.find { it.productId == (unlimited?.googlePlayId ?: "0") }
                            product?.oneTimePurchaseOfferDetails?.let {
                                unlimited?.googleAmountFormated = it.priceCurrencyCode + " " + it.formattedPrice.removeCommaAndToFloat()
                                unlimited?.googleCurrency = Currency.getInstance(it.priceCurrencyCode).symbol
                            }
                            unlimited
                        } ?: emptyList()

                        // 2. Process Limited (Refill) List
                        val limitedList = responseDetails.limited?.mapNotNull { limited ->
                            val product = list.find { it.productId == (limited?.googlePlayId ?: "0") }
                            product?.oneTimePurchaseOfferDetails?.let {
                                limited?.googleAmountFormated = it.priceCurrencyCode + " " + it.formattedPrice.removeCommaAndToFloat()
                                limited?.googleCurrency = Currency.getInstance(it.priceCurrencyCode).symbol
                            }
                            limited
                        } ?: emptyList()

                        // 3. Create the Combined List for the Adapter
                        val combinedPlanItems = ArrayList<PlanItem>()

                        // Add Subscribe Section (Header + Items) if exists
                        if (unlimitedList.isNotEmpty()) {
                            // Add Header
                            combinedPlanItems.add(PlanItem(type = PlanItem.TYPE_HEADER, title = "Subscription Plans"))

                            // Add Items
                            unlimitedList.forEach { item ->
                                combinedPlanItems.add(PlanItem(type = PlanItem.TYPE_SUBSCRIBE, subscribeData = item))
                            }
                        }

                        // Add Refill Section (Header + Items) if exists
                        if (limitedList.isNotEmpty()) {
                            // Add Header
                            combinedPlanItems.add(PlanItem(type = PlanItem.TYPE_HEADER, title = "Refill Coins"))

                            // Add Items
                            limitedList.forEach { item ->
                                combinedPlanItems.add(PlanItem(type = PlanItem.TYPE_REFILL, refillData = item))
                            }
                        }

                        combinedPlanItems.firstOrNull { it.type == PlanItem.TYPE_SUBSCRIBE }?.isSelected = true
                        // 4. Update UI on Main Thread
                        runOnUiThread {
                            mainPlanAdapter = PlanAdapter(
                                paymentOptionName,
                                items = combinedPlanItems,
                                onSubscribeClicked = { unlimited, amount ->
                                    binding.btnContinue.text = "Pay $amount"
                                },
                                onRefillClicked = { limited, amount ->
                                    isVipClick = false
                                    binding.btnContinue.text = "Pay $amount"
                                }
                            )

                            // Change this number to 2
                            val gridLayoutManager = GridLayoutManager(this@PlanActivity, 2)
                            gridLayoutManager.spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                                override fun getSpanSize(position: Int): Int {
                                    val type = mainPlanAdapter?.getItemViewType(position)
                                    return when (type) {
                                        PlanItem.TYPE_HEADER -> 2
                                        PlanItem.TYPE_SUBSCRIBE -> 2
                                        PlanItem.TYPE_REFILL -> 1
                                        else -> 2
                                    }
                                }
                            }
                            binding.plansRecyclerView.layoutManager = gridLayoutManager
                            binding.plansRecyclerView.adapter = mainPlanAdapter
                            // Handle Empty State Visibility
                            if (combinedPlanItems.isEmpty()) {
                                binding.plansRecyclerView.visibility = View.GONE
                                // binding.tvNoData.visibility = View.VISIBLE
                            } else {
                                binding.plansRecyclerView.visibility = View.VISIBLE
                            }
                        }
                    })
                    billingManager.startConnection(this@PlanActivity, coinProductIds)
                }
                binding.progressLayout.mainLayout.visibility = View.GONE
                Log.e("TAG", "loadData: " + result.data.first)
            } else if (result is ApiResult.Error) {
                showErrorEmpty(result.message)
            }
        }

        viewModel.login(viewModel.loginRequest, pref.authToken)
        viewModel.signUp.observe(this) { loginResponse ->
            binding.coinBalance.text = (loginResponse.coinBalance ?: "0").toString()
            binding.rewardsCoins.text = (loginResponse.walletBalance ?: "0").toString()
        }
    }

    private fun actionPayment(
        planId: String,
        selectedPlanId: String,
        seletedGetWay: PaymentOptionResponse.ResponseDetail?,
        currency: String,
        amount: String?
    ) {
        seletedGetWay?.let {
            val apiKey = seletedGetWay.apiId.toString()
            if (seletedGetWay.name == "GooglePlay") {
                createTransection(planId, selectedPlanId, seletedGetWay.id.toString(), currency)
//            createTransection(seletedGetWay.id.toString())
                return
            }
            val intent = when (seletedGetWay.name) {
                "RazorPay" -> {
                    Intent(this@PlanActivity, RazorpayPaymentActivity::class.java).apply {
                        putExtra(CommonsKt.PAYMENT_KEY_EXTRA, apiKey)
                        putExtra(CommonsKt.PAYMENT_AMOUNT_EXTRA, amount)
                        putExtra(CommonsKt.PLAN_ID_EXTRA, planId)
                        putExtra(CommonsKt.GETAWAY_ID_EXTRA, seletedGetWay.id.toString())
                        putExtra(CommonsKt.CURRENCY_EXTRA, currency)
                    }
                }

                else -> {
                    Intent(this@PlanActivity, StripePaymentActivity::class.java).apply {
                        putExtra(CommonsKt.PAYMENT_KEY_EXTRA, apiKey)
                        putExtra(CommonsKt.PAYMENT_AMOUNT_EXTRA, amount)
                        putExtra(CommonsKt.PLAN_ID_EXTRA, planId)
                        putExtra(CommonsKt.GETAWAY_ID_EXTRA, seletedGetWay.id.toString())
                        putExtra(CommonsKt.CURRENCY_EXTRA, currency)
                    }
                }
            }
            paymentLauncher.launch(intent)
        } ?: {
            Toast.makeText(this, "Something want to wrong. ", Toast.LENGTH_SHORT).show()
        }
    }

    private fun showEmpty() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.gone()
        progressLayout.emptyLayout.visible()
    }

    private fun showProgress() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.visible()
        progressLayout.emptyLayout.gone()
    }

    private fun showErrorEmpty(message: String) = with(binding) {
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
    }

    override fun onBackPressed() {
        if (isPaymentSuccess) {
            val resultIntent = Intent().apply {
                putExtra("isPaymentSuccess", true)
            }
            setResult(RESULT_OK, resultIntent)
            super.onBackPressed()

        } else {
            val resultIntent = Intent().apply {
                putExtra("isPaymentSuccess", false)
            }
            setResult(RESULT_CANCELED, resultIntent)
            super.onBackPressed()
        }
    }

    private fun createTransection(planId: String, googlePlanId: String, paymentGetwayId: String, currency: String) {
        runOnUiThread {
            showLoadingDialog(this)
        }

        planId?.let {
            Log.e("TAG", "❌ CancelcreateTransectionled 2 :: " + { planId.toString() })

            val request = CreatePaymentRequest(
                planId = planId.toInt(),
                paymentGetwayId = paymentGetwayId.toInt(),
                currency = currency,
            )
            viewModel.viewModelScope.launch {
                val result = viewModel.repository.createPayment(request, pref.authToken)
                if (result is ApiResult.Success) {
                    dismissLoadingDialog()

                    result.data.responseDetails?.let { responseDetails ->
                        val callback: (BillingResultState) -> Unit = { result ->
                            when (result) {
                                is BillingResultState.Success -> {
                                    verifyGooglePlayPayment(
                                        result.purchase.orderId.toString(),
                                        googlePlanId,
                                        result.purchase.purchaseToken,
                                        responseDetails.transactionId.toString(),
                                        TaskStatus.SUCCESS
                                    )
                                    Log.e("TAG", "✅ Success: " + result.purchase.orderId.toString())
                                }

                                is BillingResultState.Failure -> {
                                    Log.e("TAG", "❌ Failed 2 :: " + { result.message.toString() })
                                    verifyGooglePlayPayment(
                                        "",
                                        planId,
                                        "",
                                        responseDetails.transactionId.toString(),
                                        TaskStatus.FAILURE
                                    )
                                }

                                BillingResultState.Cancelled -> {
//                                    verifyGooglePlayPayment(
//                                        "",
//                                        planId,
//                                        "",
//                                        responseDetails.transactionId.toString(),
//                                        TaskStatus.FAILURE
//                                    )
                                    Log.e("TAG", "🚫 Payment cancelled: " + { result.toString() })
                                    Toast.makeText(this@PlanActivity, "🚫 Payment cancelled", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                        billingManager.callbackResult = callback
                        billingManager.queryProductDetails(googlePlanId)
                    }
                } else if (result is ApiResult.Error) {
                    dismissLoadingDialog()

                    showToast("createTransection API Error:" + result.message)

                }
            }
        } ?: {
            showToast("planId is null")
        }
    }

    private fun verifyGooglePlayPayment(
        orderId: String,
        productId: String,
        purchaseToken: String,
        transactionId: String,
        status: TaskStatus,
    ) {
        runOnUiThread {
            showLoadingDialog(this@PlanActivity)
        }
        Log.e("TAG", "verifyGooglePlayPayment productId: $productId")
        Log.e("TAG", "verifyGooglePlayPayment orderId: $orderId")
        Log.e("TAG", "verifyGooglePlayPayment purchaseToken: $purchaseToken")
        Log.e("TAG", "verifyGooglePlayPayment status.code: ${status.code}")
        Log.e("TAG", "verifyGooglePlayPayment transactionId: ${transactionId}")
        val request = VerifyGooglePlayPaymentRequest(
            orderId = orderId,
            productId = productId,
            purchaseToken = purchaseToken,
            status = status.code,
            transactionId = transactionId,
        )
        viewModel.viewModelScope.launch {
            val result = viewModel.repository.verifyGooglePlayPayment(request, pref.authToken)
            if (result is ApiResult.Success) {
                dismissLoadingDialog()
                result.data.responseDetails?.let { responseDetails ->
                    Log.e("TAG", "verifyGooglePlayPayment responseDetails : ${responseDetails.toString()}")
                    if (status == TaskStatus.SUCCESS) {
                        showToast("✅ Payment successful!")
                        isVipPurchased = true
                        if (isVipClick) {
                            CommonsKt.showCongratulationsDialogVip(this@PlanActivity)
                        }
                        isPaymentSuccess = true
                        loadData()
                    } else {
                        showToast("Payment Failed")
                    }
                }
            } else if (result is ApiResult.Error) {
                dismissLoadingDialog()
                //                    verifyGooglePlayPayment(
                //                        "",
                //                        orderId,
                //                        "",
                //                        transactionId,
                //                        TaskStatus.FAILURE
                //                    )
                Log.e("TAG", "verifyGoogle API Error: ${result.toString()}")
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::billingManager.isInitialized) {
            billingManager.destroy()
        }
    }

    lateinit var loadingDialog: AlertDialog
    fun showLoadingDialog(activity: Activity) {
        if (isFinishing || isDestroyed) {
            Log.e("Dialog", "Activity not running, skip showing dialog")
            return
        }
        if (!this::loadingDialog.isInitialized) {
            val dialog = AlertDialog.Builder(activity)
                .setView(R.layout.loading_dialog_layout) // Create your custom loading layout
                .setCancelable(false)
                .create()
            dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
            dialog.show()
            loadingDialog = dialog
        }
        if (!loadingDialog.isShowing) {
            loadingDialog.show()
        }
    }

    fun dismissLoadingDialog() {
        if (this::loadingDialog.isInitialized) {
            loadingDialog.dismiss()
        }
    }

    fun getSimOrNetworkCountry(context: Context): String {
        val tm = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
        return tm.simCountryIso.ifEmpty { tm.networkCountryIso }.uppercase()
    }

    fun loadPlaymentList(responseDetails: List<PaymentOptionResponse.ResponseDetail>, countryCode: String?) {
        val countryCode = countryCode ?: getSimOrNetworkCountry(this@PlanActivity)
        if (paymentOptionList == null) {
            paymentOptionList = responseDetails.filter { it.isActive == 1 }
            paymentOptionList?.let {
                paymentOptionList = when (countryCode) {
                    "IN" -> {
                        paymentOptionList?.filter { it.name != "Stripe" }
                    }
                    else -> {
                        paymentOptionList?.filter { it.name != "RazorPay" }
                    }
                }
                if (paymentOptionList?.isNotEmpty() == true) {
                    paymentOptionList!!.first().isSelected = true
                    loadTextWithImage(paymentOptionList!!.first().name)

                    bottomSheet = PaymentOptionBottomSheet(this@PlanActivity) {
                        this@PlanActivity.paymentOptionList = it
                        val name = paymentOptionList?.find { model -> model.isSelected }?.name ?: ""
                        mainPlanAdapter?.paymentOptionName = name
                        loadTextWithImage(name)
                        mainPlanAdapter?.notifyDataSetChanged()
                    }
                    bottomSheet.paymentList = paymentOptionList!!
                    binding.onPlayll.visibility = View.VISIBLE
                } else {
//                    showToast("No payment option available")
//                    finish()
                }
            }
        }

    }

    private fun loadTextWithImage(name: String?) {
        when (name) {
            "GooglePlay" -> {
                binding.imgPay.setImageResource(R.drawable.ic_google_play_rounded)
            }

                "Stripe" -> {
                binding.imgPay.setImageResource(R.drawable.ic_stripe_rounded)
            }

            "RazorPay" -> {
                binding.imgPay.setImageResource(R.drawable.ic_rezarpay_rounded)
            }

            else -> {
                name?.let { binding.imgPay.setImageBitmap(createNameBitmap(it)) }
            }
        }
        binding.tvMethod.text = name
    }
}