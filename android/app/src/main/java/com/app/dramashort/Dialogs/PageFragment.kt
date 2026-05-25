package com.app.dramashort.Dialogs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.app.dramashort.Model.CommonInfo
import com.app.dramashort.databinding.ItemRecommendedBinding
import com.bumptech.glide.Glide

class PageFragment() : Fragment() {

    private var _binding: ItemRecommendedBinding? = null
    private val binding get() = _binding!!
    var reels: List<CommonInfo> = listOf<CommonInfo>()

    companion object {
        private const val ARG_POSITION = "position"
        fun newInstance(reels: List<CommonInfo>, position: Int) = PageFragment().apply {
            this.reels = reels
            arguments = Bundle().apply {
                putInt(ARG_POSITION, position)
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        _binding = ItemRecommendedBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val position = arguments?.getInt(ARG_POSITION) ?: 0
        val item = reels[position]
//            binding.pageText.text = "This is Page ${position + 1}"
//        binding.root.setOnClickListener {
//            onClickListener(item.id.toString())
//        }
        Glide.with(binding.thumbnail)
            .load(item.poster)
            .into(binding.thumbnail)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
