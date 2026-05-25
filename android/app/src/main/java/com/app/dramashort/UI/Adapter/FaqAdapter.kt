package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.ResponseDetailX
import com.app.dramashort.R
import com.app.dramashort.databinding.ItemFaqBinding

class FaqAdapter(var items: List<ResponseDetailX>, val onClickListener: (String) -> Unit) :
    RecyclerView.Adapter<FaqAdapter.EpisodeViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EpisodeViewHolder {
        return EpisodeViewHolder(
            ItemFaqBinding.inflate(
                LayoutInflater.from(parent.context),
                null,
                false
            )
        )
    }

    override fun getItemCount() = items.size

    inner class EpisodeViewHolder(val binding: ItemFaqBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: ResponseDetailX) {
            binding.root.setOnClickListener {
                onClickListener(item.id.toString())
            }
            binding.tvQuestion.text = "Question : ${item.question}"
            binding.tvAnswer.text = "Answer : ${item.answer}"

            binding.icon.setImageResource(
                if (item.isExpanded) {
                    R.drawable.ic_minus
                } else {
                    R.drawable.ic_plus
                }
            )

            binding.tvAnswer.visibility = if (item.isExpanded) View.VISIBLE else View.GONE

            binding.icon.setOnClickListener {
                item.isExpanded = !item.isExpanded
                notifyItemChanged(position)
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

