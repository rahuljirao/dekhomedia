package com.app.dramashort.UI.Adapter

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.PlanListResponse.ResponseDetails.Unlimited
import com.app.dramashort.R
import com.app.dramashort.databinding.ItemSubListBinding

class PlanSubscribeAdapter(
    private val items: List<Unlimited?>,
    val onClickListener: (Unlimited) -> Unit,
) : RecyclerView.Adapter<PlanSubscribeAdapter.PlanSubscribeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PlanSubscribeViewHolder {
        return PlanSubscribeViewHolder(
            ItemSubListBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class PlanSubscribeViewHolder(val binding: ItemSubListBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Unlimited) {
            if (adapterPosition % 2 != 0) {
                binding.llMain.setBackgroundResource(R.drawable.btn_blue)
            } else {
                binding.llMain.setBackgroundResource(R.drawable.btn_red)

            }
            binding.name.text = (item.name ?: "").toString()

            val amount = item.googleAmountFormated ?: ("$" + item.amount)
            amount?.let {
                binding.amount.text = amount
            }?: run {
                binding.amount.text = ""
            }
            Log.e("PlanSubscribeAdapter", "bind: ")
            binding.description.text = (item.description ?: "").toString()
            binding.root.setOnClickListener {
                onClickListener(item)
            }
        }
    }


    override fun onBindViewHolder(holder: PlanSubscribeViewHolder, position: Int) {
        val item = items[position]
        Log.e("PlanSubscribeAdapter", "item: ")

        item?.let {
            holder.bind(item)
        }
    }
}