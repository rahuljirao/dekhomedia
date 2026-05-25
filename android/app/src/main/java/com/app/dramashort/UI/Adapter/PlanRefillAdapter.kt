package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.PlanListResponse.ResponseDetails.Limited
import com.app.dramashort.Utils.gone
import com.app.dramashort.databinding.ItemRefillPlanBinding

class PlanRefillAdapter(private val items: List<Limited?>, val onClickListener: (Limited) -> Unit) :
    RecyclerView.Adapter<PlanRefillAdapter.PlanRefillViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PlanRefillViewHolder {
        return PlanRefillViewHolder(ItemRefillPlanBinding.inflate(LayoutInflater.from(parent.context), null, false))
    }

    override fun getItemCount() = items.size

    inner class PlanRefillViewHolder(val binding: ItemRefillPlanBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Limited) {


            binding.coin.text = (item.coin ?: "").toString()

            if (item.extraCoin == null) {
                binding.extraCoin.isVisible = false
            } else {

                binding.extraCoin.text = item.extraCoin
            }

            val amount = item.googleAmountFormated ?: ("$" + item.amount)
            amount?.let {
                binding.amount.text = amount
            }?: run {
                binding.amount.text = ""
            }

            if (item.discountPercentage == null) {
                binding.discount.gone()
            } else {
                binding.discount.text = item.discountPercentage + "% Discount"
            }
            binding.mainLL.setOnClickListener {
                onClickListener(item)
            }
        }
    }


    override fun onBindViewHolder(holder: PlanRefillViewHolder, position: Int) {
        val item = items[position]
        item?.let {
            holder.bind(item)
        }
    }
}