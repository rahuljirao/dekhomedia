package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.TransactionListResponse
import com.app.dramashort.R
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.toBoolean
import com.app.dramashort.Utils.toFormattedDateTime
import com.app.dramashort.Utils.visible
import com.app.dramashort.databinding.ItemTransactionBinding

class TransactionListAdapter(
    private val items: List<TransactionListResponse.ResponseDetail>,
    val onClickListener: (String) -> Unit,
) : RecyclerView.Adapter<TransactionListAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(
            ItemTransactionBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemTransactionBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: TransactionListResponse.ResponseDetail) {

            binding.tvTransactionId.text = "Transaction ID: ${item.transactionId}"
            binding.tvAmount.text = "Amount: ${item.currency} ${item.amount}"

            item.coin?.let {
                binding.tvCoins.visible()
                binding.tvCoins.text = "Coins: ${item.coin} (+${item.extraCoin} extra)"
            } ?: {
                binding.tvCoins.gone()
            }

            binding.tvDiscount.gone()









            item.createdAt?.let {
                binding.tvDate.text = "Date: ${item.createdAt?.toString()?.toFormattedDateTime()}"
            } ?: {
                binding.tvDate.gone()
            }

            binding.tvStatus.text = when (item.status) {
                1 -> "In Process"
                2 -> "Completed"
                3 -> "Cancelled"
                else -> "Pending"
            }


            binding.layoutStatus.setBackgroundColor(
                when (item.status) {
                    0 -> binding.root.context.getColor(R.color.status_pending)
                    1 -> binding.root.context.getColor(R.color.status_in_process)
                    2 -> binding.root.context.getColor(R.color.status_completed)
                    3 -> binding.root.context.getColor(R.color.status_cancelled)
                    else -> binding.root.context.getColor(R.color.status_pending)
                }
            )
            if (item.isWeekly?.toBoolean == true || item.isYearly?.toBoolean == true) {
                binding.imgPurchesType.setImageResource(R.drawable.ic_vip2)
            } else {
                binding.imgPurchesType.setImageResource(R.drawable.ic_coin_man)
            }
            binding.root.setOnClickListener {
                onClickListener(item.id.toString())
            }

        }
    }

    override fun onBindViewHolder(holder: EpisodeViewHolder, position: Int) {
        holder.bind(items[position])
    }
}

