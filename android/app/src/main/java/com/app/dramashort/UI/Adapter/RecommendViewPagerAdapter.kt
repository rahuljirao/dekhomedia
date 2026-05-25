package com.app.dramashort.UI.Adapter

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.app.dramashort.Dialogs.PageFragment
import com.app.dramashort.Model.CommonInfo

class RecommendViewPagerAdapter(
    fragmentActivity: FragmentActivity,
    var reels: List<CommonInfo>,
    val setOnClickListener: (String, RecommendedAdapter) -> Unit,
) : FragmentStateAdapter(fragmentActivity) {

    override fun getItemCount(): Int = reels.size

    override fun createFragment(position: Int): Fragment {
        return PageFragment.Companion.newInstance(reels, position)
    }


}