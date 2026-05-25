package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.App.ReelShortApp
import com.app.dramashort.Model.CommonInfoReel
import com.app.dramashort.databinding.ItemEpisodeListBinding

class EpisodeListAdapter(var items: List<CommonInfoReel>, val onClickListener: (Int) -> Unit) :
    RecyclerView.Adapter<EpisodeListAdapter.EpisodeListViewHolder>() {

    var itemsList: List<CommonInfoReel> = ArrayList()

    fun submitList(infos: List<CommonInfoReel>, itemsList: List<CommonInfoReel>) {
        this.items = ArrayList()
        this.items = infos

        this.itemsList = ArrayList()
        this.itemsList = itemsList
        this.notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeListViewHolder {
        return EpisodeListViewHolder(
            ItemEpisodeListBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class EpisodeListViewHolder(val binding: ItemEpisodeListBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(item: CommonInfoReel) {
            binding.root.setOnClickListener {
                if (!item.isLocked) {
                    onClickListener(adapterPosition)
                } else {
                    Toast.makeText(
                        ReelShortApp.instance,
                        "Watch previous episode first",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
            if (item.coverVideo != null) {
                binding.tvNumber.text = item.coverVideo!!
                return
            }

            if (item.isPlaying) {
                binding.musicAnim.visibility = View.VISIBLE
            } else {
                binding.musicAnim.visibility = View.GONE
            }

            if (item.isTrailer) {
                binding.tvNumber.text = "TRAILER"
            } else {
                item.episodeNumber?.let {
                    binding.tvNumber.text = item.episodeNumber.toString()
                }
                binding.requiredCoin.text = item.requiredCoin.toString()
//                binding.requiredCoin.visibility = View.VISIBLE
            }
            if (!item.isLocked) {
                binding.imageLock.visibility = View.GONE

            } else {
                binding.imageLock.visibility = View.VISIBLE


            }
        }
    }


    override fun onBindViewHolder(holder: EpisodeListViewHolder, position: Int) {
        items[position].let { item ->
            holder.bind(item)
        }
    }

}