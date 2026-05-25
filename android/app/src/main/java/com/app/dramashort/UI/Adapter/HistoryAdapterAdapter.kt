package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.MyListResponse.ResponseDetails.History
import com.app.dramashort.R
import com.app.dramashort.databinding.ItemHistoryBinding
import com.bumptech.glide.Glide

class HistoryAdapterAdapter(
    var items: List<History>,
    val onSelectedSelectionView: () -> Unit,
    val onClickListener: (String) -> Unit,
) : RecyclerView.Adapter<HistoryAdapterAdapter.MyListAdapterViewHolder>() {

    val selectedItems = mutableListOf<History>()
    private val selectedIndices = mutableListOf<Int>()
    var isSelectionMode = false

    inner class MyListAdapterViewHolder(val binding: ItemHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: History, position: Int) {
            binding.title.text = item.title
            binding.lastEpisode.text = "EP.${item.lastViewedEpisode}"
            binding.totalEpisode.text = "/EP.${(item.totalEpisode)}"
            binding.progressBar.progress = item.lastViewedEpisode ?: 0
            binding.progressBar.max = item.totalEpisode ?: 0

            Glide.with(binding.thumbnail.context)
                .load(item.thumbnail)
                .into(binding.thumbnail)

            binding.selected.visibility = if (isSelectionMode) View.VISIBLE else View.GONE

            val isSelected = selectedIndices.contains(position)
            binding.selected.setImageResource(
                if (isSelected) {
                    R.drawable.ic_check
                } else {
                    R.drawable.ic_un_check
                }
            )

            binding.root.setOnClickListener {
                if (isSelectionMode) {
                    toggleSelection(position)
                } else {
                    onClickListener(item.id.toString())
                }
            }

            binding.root.setOnLongClickListener {
                if (!isSelectionMode) {
                    isSelectionMode = true
                    toggleSelection(position)
                }
                true
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MyListAdapterViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return MyListAdapterViewHolder(ItemHistoryBinding.inflate(inflater, parent, false))
    }

    override fun onBindViewHolder(holder: MyListAdapterViewHolder, position: Int) {
        holder.bind(items[position], position)
    }

    override fun getItemCount(): Int = items.size


    fun toggleSelection(position: Int) {
        val item = items[position]
        if (selectedItems.contains(item)) {
            selectedItems.remove(item)
            selectedIndices.remove(position)
        } else {
            selectedItems.add(item)
            selectedIndices.add(position)
        }

        isSelectionMode = selectedItems.isNotEmpty()
        notifyItemChanged(position)
        onSelectedSelectionView()
    }

    fun clearSelection() {
        selectedIndices.forEach { notifyItemChanged(it) }
        selectedItems.clear()
        selectedIndices.clear()
        isSelectionMode = false
        onSelectedSelectionView()
    }

    fun selectAll() {
        selectedItems.clear()
        selectedIndices.clear()

        for (i in items.indices) {
            selectedItems.add(items[i])
            selectedIndices.add(i)
            notifyItemChanged(i)
        }

        isSelectionMode = selectedItems.isNotEmpty()
        onSelectedSelectionView()
    }

    fun clearSelection2() {
        selectedIndices.forEach { notifyItemChanged(it) }
        selectedItems.clear()
        selectedIndices.clear()
        isSelectionMode = false

    }


    fun updateItem() {
        for (index in items.indices) {
            notifyItemChanged(index, 1)
        }
    }
}




















































