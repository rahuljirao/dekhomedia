package com.app.dramashort.Model

import androidx.annotation.Keep
import com.google.gson.annotations.SerializedName

@Keep
data class CreateTicketResponse(
    @SerializedName("responseCode")
    val responseCode: String?,
    @SerializedName("responseDetails")
    val responseDetails: ResponseDetails?,
    @SerializedName("responseMessage")
    val responseMessage: String?,
) {
    @Keep
    data class ResponseDetails(
        @SerializedName("created_at")
        val createdAt: String?,
        @SerializedName("description")
        val description: String?,
        @SerializedName("email")
        val email: String?,
        @SerializedName("id")
        val id: Int?,
        @SerializedName("name")
        val name: String?,
        @SerializedName("reason")
        val reason: String?,
        @SerializedName("status")
        val status: String?,
        @SerializedName("ticket_id")
        val ticketId: String?,
        @SerializedName("updated_at")
        val updatedAt: Any?,
    )
}
