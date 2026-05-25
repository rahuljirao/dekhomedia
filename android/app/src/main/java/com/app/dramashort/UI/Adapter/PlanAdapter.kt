package com.app.dramashort.UI.Adapter

import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.PlanListResponse.ResponseDetails.Limited
import com.app.dramashort.Model.PlanListResponse.ResponseDetails.Unlimited
import com.app.dramashort.R
import com.app.dramashort.Utils.gone
import com.app.dramashort.databinding.ItemRefillPlanBinding
import com.app.dramashort.databinding.ItemSubListBinding


data class PlanItem(
    val type: Int,
    val title: String? = null,        // For Header text
    val refillData: Limited? = null,  // For Refill items
    val subscribeData: Unlimited? = null, // For Subscribe items
    var isSelected: Boolean = false // <--- New Field
) {
    companion object {
        const val TYPE_HEADER = 0
        const val TYPE_REFILL = 1
        const val TYPE_SUBSCRIBE = 2
    }
}

class PlanAdapter(
    var paymentOptionName: String,
    private val items: List<PlanItem>,
    private val onRefillClicked: (Limited, String) -> Unit,
    private val onSubscribeClicked: (Unlimited, String) -> Unit
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    override fun getItemViewType(position: Int): Int {
        return items[position].type
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            PlanItem.TYPE_REFILL -> {
                RefillViewHolder(ItemRefillPlanBinding.inflate(inflater, parent, false))
            }

            PlanItem.TYPE_SUBSCRIBE -> {
                SubscribeViewHolder(ItemSubListBinding.inflate(inflater, parent, false))
            }

            else -> {
                HeaderViewHolder(inflater.inflate(R.layout.item_header, parent, false))
            }
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val item = items[position]

        when (holder) {
            is RefillViewHolder -> {
                item.refillData?.let { data ->
                    holder.bind(data, item.isSelected)
                    holder.itemView.setOnClickListener {
                        handleSelection(position)
                        onRefillClicked(data, holder.binding.amount.text.toString())
                    }
                }
            }

            is SubscribeViewHolder -> {
                item.subscribeData?.let {
                    holder.bind(it, item.isSelected)
                    holder.itemView.setOnClickListener {
                        handleSelection(position)
                        onSubscribeClicked(item.subscribeData, holder.binding.amount.text.toString())
                    }
                }
            }

            is HeaderViewHolder -> {
                holder.bind(item.title ?: "")
            }
        }
    }

    override fun getItemCount(): Int = items.size

    // --- ViewHolders ---

    // 1. Header ViewHolder (Simple Text)
    inner class HeaderViewHolder(itemView: android.view.View) : RecyclerView.ViewHolder(itemView) {
        fun bind(title: String) {
            // Adjust ID to match your header layout
            itemView.findViewById<android.widget.TextView>(R.id.tvHeader).text = title
        }
    }

    // 2. Refill ViewHolder (Logic moved from PlanRefillAdapter)
    inner class RefillViewHolder(val binding: ItemRefillPlanBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Limited, isSelected: Boolean) {


            binding.coin.text = (item.coin ?: "").toString()

            if (item.extraCoin == null) {
                binding.extraCoin.isVisible = false
            } else {
                binding.extraCoin.isVisible = true // Ensure visibility is reset
                binding.extraCoin.text = item.extraCoin
            }

//            val amount = when (paymentOptionName) {
//                "GooglePlay" -> {
//                    item.googleAmountFormated!!
//                }
//
//                "RazorPay", "Stripe" -> {
//                    item.displayCurrency + " " + item.formattedPrice
//                }
//
//                else -> {
//                    item.googleAmountFormated!!
//                }
//            }
            binding.amount.text = displayAmount(item)
            Log.e("RefillViewHolder", "bind amount: " + displayAmount(item))
            Log.e("RefillViewHolder", "bind paymentOptionName: " + paymentOptionName)


            if (item.discountPercentage == null) {
                binding.discount.gone()
            } else {
                binding.discount.isVisible = true
                binding.discount.text = "${item.discountPercentage}% Discount"
            }

            // --- VISUAL SELECTION LOGIC ---
            if (isSelected) {
                // Example: Add a stroke/border or visible checkmark
                binding.mainLL.setBackgroundResource(R.drawable.bg_refill_selected_border) // Create this drawable
                // OR
                // binding.imgCheck.visibility = View.VISIBLE
            } else {
                binding.mainLL.setBackgroundResource(R.drawable.bg_refill_unselected) // Reset to normal
                // OR
                // binding.imgCheck.visibility = View.GONE
            }
        }


    }

    // 3. Subscribe ViewHolder (Logic moved from PlanSubscribeAdapter)
    inner class SubscribeViewHolder(val binding: ItemSubListBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Unlimited, isSelected: Boolean) {
            // Handle alternating background colors

            binding.name.text = (item.name ?: "").toString()

            Log.e("TAG", "bind paymentOptionName 111 : $paymentOptionName")




            binding.amount.text = displayAmount(item)
//            binding.amount.text = when (paymentOptionName) {
//                "GooglePlay" -> {
//                    item.googleAmountFormated!!
//                }
//
//                "RazorPay", "Stripe" -> {
//                    item.displayCurrency + " " + item.formattedPrice
//                }
//
//                else -> {
//                    item.googleAmountFormated!!
//                }
//            }
            binding.description.text = (item.description ?: "").toString()
            val normalBackground = if (adapterPosition % 2 != 0) R.drawable.btn_blue else R.drawable.btn_red

            if (isSelected) {
                // Example: Change background or add a border
                binding.llMain.setBackgroundResource(R.drawable.bg_refill_selected_border)
            } else {
                binding.llMain.setBackgroundResource(R.drawable.bg_refill_unselected)
            }
        }
    }

    // --- NEW: Logic to select one item and deselect others ---
    private fun handleSelection(adapterPosition: Int) {
        // 1. Deselect everything
        items.forEach { it.isSelected = false }

        // 2. Select the clicked item
        if (adapterPosition != RecyclerView.NO_POSITION) {
            items[adapterPosition].isSelected = true
        }

        // 3. Refresh the list to update UI
        notifyDataSetChanged()
    }

    // Inside PlanAdapter class
    fun getSelectedItem(): PlanItem? {
        return items.find { it.isSelected }
    }

    init {
        val firstIndex = items.indexOfFirst {
            it.type == PlanItem.TYPE_REFILL || it.type == PlanItem.TYPE_SUBSCRIBE
        }

        if (firstIndex != -1) {
            val item = items[firstIndex]
            item.isSelected = true

            // 🔹 Fire callback once automatically
            when (item.type) {
                PlanItem.TYPE_REFILL ->
                    item.refillData?.let {
                        onRefillClicked(it, displayAmount(it))
                    }

                PlanItem.TYPE_SUBSCRIBE ->
                    item.subscribeData?.let {
                        onSubscribeClicked(it, displayAmount(it))
                    }
            }
        }
    }

    fun displayAmount(item: Unlimited): String {
        return when (paymentOptionName) {
            "GooglePlay" -> item.googleAmountFormated ?: ""
            "RazorPay", "Stripe" -> "${item.displayCurrency} ${item.formattedPrice}"
            else -> item.googleAmountFormated ?: ""
        }
    }
    fun displayAmount(item: Limited): String {
        return when (paymentOptionName) {
            "GooglePlay" -> item.googleAmountFormated ?: ""
            "RazorPay", "Stripe" -> "${item.displayCurrency} ${item.formattedPrice}"
            else -> item.googleAmountFormated ?: ""
        }
    }
}