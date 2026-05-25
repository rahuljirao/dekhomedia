package com.app.dramashort.UI.Adapter

import android.R.attr.text
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.UserWatchedSeriesListResponse
import com.app.dramashort.Utils.asBoolean
import com.app.dramashort.databinding.ItemAutoUnlockBinding
import com.bumptech.glide.Glide

class AutoUnlockedListAdapter(
    private val items: List<UserWatchedSeriesListResponse.ResponseDetail>,
    val setOnCheckedChangeListener: (Int, Boolean) -> Unit,
    val onClickListener: (String) -> Unit,
) : RecyclerView.Adapter<AutoUnlockedListAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(
            ItemAutoUnlockBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemAutoUnlockBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: UserWatchedSeriesListResponse.ResponseDetail) {

            binding.title.text = "${item.title}"
            binding.lastViewedEpisode.text = "Played to Episode ${item.lastViewedEpisode}"

            item.isAutoUnlocked?.let {
                binding.unlockSwitch.isChecked = item.isAutoUnlocked.asBoolean
            }
            Glide.with(binding.thumbnail)
                .load(item.thumbnail)
                .into(binding.thumbnail)


            binding.unlockSwitch.setOnCheckedChangeListener { buttonView, isChecked ->
                setOnCheckedChangeListener(item.seriesId!!, isChecked)
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

