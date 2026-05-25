package com.app.dramashort.UI.Adapter

import android.R.attr.name
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.PaymentOptionResponse
import com.app.dramashort.R
import com.app.dramashort.Utils.createNameBitmap
import com.app.dramashort.databinding.ItemPaymentOptionBinding

class PaymentAdapter(
    val items: List<PaymentOptionResponse.ResponseDetail>,
    val onClickListener: (PaymentOptionResponse.ResponseDetail) -> Unit,
) :
    RecyclerView.Adapter<PaymentAdapter.TagsAdapter>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TagsAdapter {
        return TagsAdapter(
            ItemPaymentOptionBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class TagsAdapter(val binding: ItemPaymentOptionBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: PaymentOptionResponse.ResponseDetail) {
            when (item.name) {
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
                    item.name?.let { binding.imgPay.setImageBitmap(createNameBitmap(it)) }
                }
            }
            binding.selected.setImageResource(
                if (item.isSelected) {
                    R.drawable.ic_check
                } else {
                    R.drawable.ic_un_check
                }
            )
            binding.root.setOnClickListener {
                onClickListener(item)
            }
            binding.name.text = item.name
        }
    }

    override fun onBindViewHolder(holder: TagsAdapter, position: Int) {
        holder.bind(items[position])
    }


}