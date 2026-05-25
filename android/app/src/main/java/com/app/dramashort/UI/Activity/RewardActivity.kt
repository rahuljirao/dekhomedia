package com.app.dramashort.UI.Activity

import android.os.Bundle
import android.view.View
import com.app.dramashort.R
import com.app.dramashort.UI.Fragment.RewardsFragment
import com.app.dramashort.databinding.ActivityRewardBinding
import dagger.hilt.android.AndroidEntryPoint
import test.app.gallery.UI1.Base.BaseActivity

@AndroidEntryPoint
class RewardActivity : BaseActivity() {

    lateinit var binding: ActivityRewardBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRewardBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }

    override fun onResume() {
        super.onResume()
        val myListFragment = supportFragmentManager.findFragmentById(R.id.fragment_container_view) as? RewardsFragment
        myListFragment?.binding?.llToolbar?.visibility = View.VISIBLE
        myListFragment?.binding?.llToolbar?.setOnClickListener {
            onBackPressed()
        }
    }
}