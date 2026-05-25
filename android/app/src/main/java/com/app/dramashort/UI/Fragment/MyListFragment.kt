package com.app.dramashort.UI.Fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.app.dramashort.databinding.FragmentMyListBinding
import com.google.android.material.tabs.TabLayoutMediator
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseFragment


@AndroidEntryPoint
class MyListFragment : BaseFragment() {



    lateinit var  listFragment :ListFragment
    lateinit var  historyFragment :HistoryFragment

    lateinit var binding: FragmentMyListBinding


    companion object {
        var myListFragment: MyListFragment? = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        myListFragment = this
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {

        binding = FragmentMyListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.apply {

            listFragment  = ListFragment()
            historyFragment  = HistoryFragment()


            val adapter = CategoryPagerAdapter(requireActivity())
            viewPager.adapter = adapter
            TabLayoutMediator(tabLayout, viewPager) { tab, position ->
                tab.text = adapter.getPageTitle(position)
            }.attach()
        }

    }

    inner class CategoryPagerAdapter(fragment: FragmentActivity) :
        FragmentStateAdapter(fragment) {

        private val fragments = listOf(
            listFragment,
            historyFragment,
        )

        private val titles = listOf(
            "My List", "History",
        )

        override fun getItemCount(): Int = fragments.size
        override fun createFragment(position: Int): Fragment = fragments[position]
        fun getPageTitle(position: Int): String = titles[position]
    }

    override fun onResume() {
        super.onResume()
        reelsAdapter2?.pauseAllPlayers()
        if(listFragment.isAdded){
            listFragment.onResume()
        }

    }
}

//@AndroidEntryPoint
//class MyListFragment : BaseFragment() {
//
//
//
//    lateinit var  listFragment :ListFragment
//    lateinit var  historyFragment :HistoryFragment
//
//    lateinit var binding: FragmentMyListBinding
//
//
//    companion object {
//        var myListFragment: MyListFragment? = null
//    }
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        myListFragment = this
//    }
//
//    override fun onCreateView(
//        inflater: LayoutInflater,
//        container: ViewGroup?,
//        savedInstanceState: Bundle?,
//    ): View {
//
//        binding = FragmentMyListBinding.inflate(inflater, container, false)
//        return binding.root
//    }
//
//    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
//        super.onViewCreated(view, savedInstanceState)
//        binding.apply {
//
//            listFragment  = ListFragment()
//            historyFragment  = HistoryFragment()
//
//
//            val adapter = CategoryPagerAdapter(requireActivity())
//            viewPager.adapter = adapter
//            TabLayoutMediator(tabLayout, viewPager) { tab, position ->
//                tab.text = adapter.getPageTitle(position)
//            }.attach()
//        }
//
//    }
//
//    inner class CategoryPagerAdapter(fragment: FragmentActivity) :
//        FragmentStateAdapter(fragment) {
//
//        private val fragments = listOf(
//            listFragment,
//            historyFragment,
//        )
//
//        private val titles = listOf(
//            "My List", "History",
//        )
//
//        override fun getItemCount(): Int = fragments.size
//        override fun createFragment(position: Int): Fragment = fragments[position]
//        fun getPageTitle(position: Int): String = titles[position]
//    }
//
//    override fun onResume() {
//        super.onResume()
//        reelsAdapter2?.pauseAllPlayers()
//        listFragment.onResume()
//
//    }
//}