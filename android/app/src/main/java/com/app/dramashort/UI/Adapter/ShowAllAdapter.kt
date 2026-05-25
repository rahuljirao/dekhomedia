package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.CategorySection
import com.app.dramashort.databinding.ItemShowAllBinding

class ShowAllAdapter(
    private val items: List<CategorySection>,
    val onClickListener: (String) -> Unit,
    val onClickSeeAllListener: (CategorySection) -> Unit,
) : RecyclerView.Adapter<ShowAllAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(ItemShowAllBinding.inflate(LayoutInflater.from(parent.context), null, false))
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemShowAllBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: CategorySection) {

            binding.icon.setImageResource(item.icon)
            binding.title.text = item.title
            val top3Episodes = item.items.take(3)
            binding.subRecycler.apply {
                layoutManager = GridLayoutManager(context, 3)
                adapter = CommonInfoAdapter(top3Episodes) { id ->
                    onClickListener(id)
                }
            }
            binding.viewAll.setOnClickListener {
                onClickSeeAllListener(item)
            }
        }
    }


    override fun onBindViewHolder(holder: EpisodeViewHolder, position: Int) {
        val item = items[position]
        item.let {
            holder.bind(item)
        }
    }
}

