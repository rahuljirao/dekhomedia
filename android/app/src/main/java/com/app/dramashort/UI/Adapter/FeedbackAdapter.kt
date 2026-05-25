package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.databinding.ItemImageFeedbackBinding
import com.bumptech.glide.Glide

class FeedbackAdapter(
    var feedbackData: ArrayList<String>,
    private val onSelectListener: (Int) -> Unit,
) : RecyclerView.Adapter<FeedbackAdapter.ViewHolder>() {
    var selectedIndex: Int = -1

    fun setData(list: ArrayList<String>) {
        feedbackData = list
        notifyDataSetChanged()
    }


    inner class ViewHolder(val binding: ItemImageFeedbackBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: String, position: Int) {


            Glide.with(binding.imageView.context)
                .load(item)
                .into(binding.imageView)

            binding.deleteIcon.setOnClickListener {
                feedbackData.removeAt(adapterPosition)
                notifyDataSetChanged()
            }
            binding.root.setOnClickListener {
                selectedIndex = position
                notifyDataSetChanged()
                onSelectListener(position)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemImageFeedbackBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun getItemCount(): Int = feedbackData.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(feedbackData[position], position)
    }
}