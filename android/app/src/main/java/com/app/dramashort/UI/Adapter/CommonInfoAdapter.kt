package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.CommonInfo
import com.app.dramashort.Utils.CommonsKt.formatNumber
import com.app.dramashort.Utils.toBoolean
import com.app.dramashort.Utils.visible
import com.app.dramashort.databinding.ItemEpisodeBinding
import com.bumptech.glide.Glide

class CommonInfoAdapter(private val items: List<CommonInfo>, val onClickListener: (String) -> Unit) :
    RecyclerView.Adapter<CommonInfoAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(ItemEpisodeBinding.inflate(LayoutInflater.from(parent.context), null, false))
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemEpisodeBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: CommonInfo) {
            binding.root.setOnClickListener {
                onClickListener(item.id.toString())
            }
            if (item.isFree?.toBoolean == true) {
                binding.freeLabel.visible()
            }

            binding.textTitle.text = item.title
            binding.textTag.text = item.tagsName
            binding.categoryName.text = item.categoryName
            binding.textViews.text = item.views?.formatNumber()

            Glide.with(binding.imagePoster.context)
                .load(item.thumbnail)
                .into(binding.imagePoster)


        }
    }


    override fun onBindViewHolder(holder: EpisodeViewHolder, position: Int) {
        val item = items[position]
        item?.let {
            holder.bind(item)
        }
    }
}

