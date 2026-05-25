package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.CommonInfo
import com.app.dramashort.databinding.ItemRecommendedBinding
import com.bumptech.glide.Glide

class RecommendedAdapter(
    private val items: List<CommonInfo?>,
    val onClickListener: (String) -> Unit,
) : RecyclerView.Adapter<RecommendedAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(
            ItemRecommendedBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemRecommendedBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: CommonInfo) {
            binding.root.setOnClickListener {
                onClickListener(item.id.toString())
            }
            Glide.with(binding.thumbnail)
                .load(item.thumbnail)
                .into(binding.thumbnail)
        }
    }


    override fun onBindViewHolder(holder: EpisodeViewHolder, position: Int) {
        val item = items[position]
        item?.let {
            holder.bind(item)
        }
    }
}

