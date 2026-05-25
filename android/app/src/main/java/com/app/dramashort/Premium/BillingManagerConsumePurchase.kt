package com.app.dramashort.Premium


import android.app.Activity
import android.util.Log
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.ConsumeParams
import com.android.billingclient.api.ProductDetails
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.dramaking.shortreels.Premum.BillingResultState
import kotlin.String


class BillingManagerConsumePurchase(
    private val context: Activity,
//    private val productId: String,
    var callbackList: (List<ProductDetails>) -> Unit,
    var callbackResult: (BillingResultState) -> Unit = {}, // 👈 Callback here
) : PurchasesUpdatedListener {

    private var billingClient: BillingClient? = null
    private var activity: Activity? = null

//    init {
//        startConnection(context)
//    }

    fun startConnection(activity: Activity,coinProductIds:List<String> ) {
        this.activity = activity
        billingClient = BillingClient.newBuilder(context)
            .setListener(this)
            .enablePendingPurchases()
            .build()

        billingClient?.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    loadCoinProducts(coinProductIds){
                        callbackList.invoke(it)
                    }
                } else {
                    callbackResult(BillingResultState.Failure("Billing setup failed"))
                }
            }

            override fun onBillingServiceDisconnected() {
                callbackResult(BillingResultState.Failure("Billing service disconnected"))
            }
        })
    }


    fun loadCoinProducts(coinProductIds:List<String>, callbackList: (List<ProductDetails>) -> Unit){
//        this.callbackList = callbackList


        val productList = coinProductIds.map {
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(it)
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        }

        Log.e("TAG", "loadCoinProducts productList: "+productList)

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build()

        Log.e("TAG", "loadCoinProducts params: "+params)


        billingClient?.queryProductDetailsAsync(params) { result, products ->
            Log.e("TAG", "loadCoinProducts : "+products.size)
            if (result.responseCode == BillingClient.BillingResponseCode.OK && products.isNotEmpty()) {
                callbackList(products)
            } else {
                BillingResultState.Failure("Failed to load product details: ${result.debugMessage}")
                callbackList(emptyList())
            }
        } ?: callbackList(emptyList())

    }


    fun queryProductDetails(productId: String) {
        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(
                listOf(
                    QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build()
                )
            ).build()

        billingClient?.queryProductDetailsAsync(params) { result, products ->
            if (result.responseCode == BillingClient.BillingResponseCode.OK && products.isNotEmpty()) {
                launchPurchaseFlow(products.first())
            } else {
                callbackResult(BillingResultState.Failure("Product not found or billing error"))
            }
        }
    }

    private fun launchPurchaseFlow(productDetails: ProductDetails) {
        val params = BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(productDetails)
            .build()

        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(listOf(params))
            .build()

        billingClient?.launchBillingFlow(activity!!, flowParams)
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: MutableList<Purchase>?) {
        when (result.responseCode) {
            BillingClient.BillingResponseCode.OK -> {
                purchases?.forEach {
                    acknowledgePurchase(it)
                    callbackResult(BillingResultState.Success(it))
                }
            }

            BillingClient.BillingResponseCode.USER_CANCELED -> {
                callbackResult(BillingResultState.Cancelled)
            }

            else -> {
                callbackResult(BillingResultState.Failure(result.debugMessage))
            }
        }
    }

    private fun acknowledgePurchase(purchase: Purchase) {
        val params = ConsumeParams.newBuilder()
            .setPurchaseToken(purchase.purchaseToken)
            .build()


        billingClient?.consumeAsync(params) { result, _ ->
            if (result.responseCode != BillingClient.BillingResponseCode.OK) {
                callbackResult(BillingResultState.Failure("Failed to acknowledge purchase"))
            }
        }
    }

    fun destroy() {
        billingClient?.endConnection()
        billingClient = null
        activity = null
    }
}

