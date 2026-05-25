package com.dramaking.shortreels.Premum

import com.android.billingclient.api.Purchase

sealed class BillingResultState {
    data class Success(val purchase: Purchase) : BillingResultState()
    data class Failure(val message: String) : BillingResultState()
    object Cancelled : BillingResultState()
}
