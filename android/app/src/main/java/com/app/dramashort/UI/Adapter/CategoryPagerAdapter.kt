package com.app.dramashort.UI.Adapter

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.app.dramashort.Model.CategorySection
import com.app.dramashort.UI.Fragment.CategoryFragment
import com.app.dramashort.UI.Fragment.HomeFragment

class CategoryPagerAdapter(
    fragmentActivity: HomeFragment,
    private val categories: List<CategorySection>,
) : FragmentStateAdapter(fragmentActivity) {

    override fun getItemCount(): Int = categories.size

    override fun createFragment(position: Int): Fragment {
        return CategoryFragment.newInstance(categories[position])
    }

    fun getPageTitle(position: Int): String = categories[position].title
}