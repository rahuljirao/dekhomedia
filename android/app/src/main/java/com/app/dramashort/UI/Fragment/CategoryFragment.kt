package com.app.dramashort.UI.Fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.GridLayoutManager
import com.app.dramashort.Model.CategorySection
import com.app.dramashort.UI.Activity.ReelsActivity
import com.app.dramashort.UI.Adapter.CommonInfoAdapter
import com.app.dramashort.Utils.CommonsKt
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.databinding.FragmentCategoryBinding
import com.google.gson.Gson
import test.app.gallery.UI1.Base.BaseFragment
import kotlin.jvm.java

class CategoryFragment : BaseFragment() {

    private var category: CategorySection? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val json = arguments?.getString("category_json")
        category = json?.let {
            Gson().fromJson(it, CategorySection::class.java)
        }
    }

    lateinit var binding: FragmentCategoryBinding
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?,
    ): View {
        binding = FragmentCategoryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadData()
    }

    private fun loadData() {
        binding.recyclerView.layoutManager = GridLayoutManager(context, 3)
        showProgress()
        category?.items?.let { series ->
            val adapter = CommonInfoAdapter(series) { seriesId ->
                startActivity(Intent(requireActivity(), ReelsActivity::class.java).apply {
                    putExtra(CommonsKt.SERIES_ID_EXTRA, seriesId)
                })
            }
            binding.recyclerView.adapter = adapter
            if (series.isEmpty()) {
                showEmpty()
            } else {
                binding.progressLayout.mainLayout.visibility = View.GONE
            }
        }
    }

    companion object {
        fun newInstance(category: CategorySection): CategoryFragment {
            val json = Gson().toJson(category)
            return CategoryFragment().apply {
                arguments = Bundle().apply {
                    putString("category_json", json)
                }
            }
        }
    }

    private fun showEmpty() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.gone()
        progressLayout.emptyLayout.visible()
    }

    private fun showProgress() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.visible()
        progressLayout.emptyLayout.gone()
    }

}
