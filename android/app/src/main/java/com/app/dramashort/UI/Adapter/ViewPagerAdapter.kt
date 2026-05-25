package com.app.dramashort.UI.Adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.app.dramashort.Model.HomeListResponse
import com.app.dramashort.Utils.CommonsKt.capitalizeFirstLetter
import com.app.dramashort.databinding.ItemPagerBinding
import com.bumptech.glide.Glide

class ViewPagerAdapter(
    val albums: List<HomeListResponse.ResponseDetails.NewRelese?>,
    val onClickListener: (String) -> Unit,
) :
    RecyclerView.Adapter<ViewPagerAdapter.ViewPagerViewHolder>() {
    inner class ViewPagerViewHolder(val binding: ItemPagerBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewPagerViewHolder {
        val binding = ItemPagerBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewPagerViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewPagerViewHolder, position: Int) {
        val item = albums[position]
        item?.let {
            Glide.with(holder.binding.thumbnail.context)
                .load(item.thumbnail)
                .into(holder.binding.thumbnail)

            holder.binding.tag1.text = "⦁  " + item.tagsName?.capitalizeFirstLetter()
            holder.binding.tag2.text = "⦁  " + item.categoryName?.capitalizeFirstLetter()
            holder.binding.tag3.visibility = View.GONE

            holder.binding.btnPlay.setOnClickListener {
                onClickListener(item.id.toString())
            }
        }
    }

    override fun getItemCount() = albums.size
}