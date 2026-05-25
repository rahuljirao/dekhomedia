package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.RewardHistoryResponse
import com.app.dramashort.Utils.toFormattedDateTime
import com.app.dramashort.databinding.ItemRewardHistoryBinding

class RewardHistoryAdapter(private val items: List<RewardHistoryResponse.ResponseDetail>, val onClickListener: (String) -> Unit) :
    RecyclerView.Adapter<RewardHistoryAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(ItemRewardHistoryBinding.inflate(LayoutInflater.from(parent.context), null, false))
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemRewardHistoryBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: RewardHistoryResponse.ResponseDetail) {
            binding.root.setOnClickListener {
                onClickListener(item.id.toString())
            }
            binding.name.text = item.title
            binding.coin.text = item.coin.toString()
            binding.expires.text = item.expired?.toFormattedDateTime()
            binding.date.text = item.createdAt?.toFormattedDateTime()

        }
    }

    override fun onBindViewHolder(holder: EpisodeViewHolder, position: Int) {
        holder.bind(items[position])
    }
}

