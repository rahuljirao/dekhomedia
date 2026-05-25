package com.app.dramashort.Dialogs

import android.os.Bundle
import android.view.View
import com.app.dramashort.Model.PaymentOptionResponse
import com.app.dramashort.UI.Activity.PlanActivity
import com.app.dramashort.UI.Adapter.PaymentAdapter
import com.app.dramashort.UI.Base.BaseBottomSheetDialogFragment
import com.app.dramashort.Utils.gone
import com.app.dramashort.Utils.visible
import com.app.dramashort.databinding.ActivityPaymentOptionBinding
import com.google.android.material.bottomsheet.BottomSheetBehavior


class PaymentOptionBottomSheet(
//    val selectedPlanId: String,
//    val amount: String,
//    val paymentLauncher: ActivityResultLauncher<Intent>,
//    val currency: String,
    val planActivity: PlanActivity,
    val onSelected: (List<PaymentOptionResponse.ResponseDetail>) -> Unit,
) :
    BaseBottomSheetDialogFragment<ActivityPaymentOptionBinding>(
        bindingInflater = { inflater, container, _ ->
            ActivityPaymentOptionBinding.inflate(inflater, container, false)
        }
    ) {
    companion object {
        const val TAG = "TagWiseListBottomSheet"
    }

    private lateinit var reelsAdapter: PaymentAdapter
    var paymentList: List<PaymentOptionResponse.ResponseDetail> = emptyList()

    override fun getInitialBottomSheetState(): Int {
        return BottomSheetBehavior.STATE_EXPANDED
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        showProgress()
        binding.btnBack.setOnClickListener { dismiss() }
        setList(paymentList)
    }

    fun setList(paymentList: List<PaymentOptionResponse.ResponseDetail>) {
        this@PaymentOptionBottomSheet.paymentList = paymentList
        reelsAdapter = PaymentAdapter(paymentList) { selectedItem ->

            planActivity.binding.tvMethod.text = selectedItem.name
            paymentList.forEach { it.isSelected = false }   // clear all
            selectedItem.isSelected = true                  // select clicked one
            reelsAdapter.notifyDataSetChanged()
            onSelected(paymentList)
            dismiss()
        }
        if(paymentList.isNotEmpty()){
            binding.progressLayout.progressAnimation.gone()
//            binding.progressLayout.emptyLayout.gone()
        }
        binding.recyclerView.adapter = reelsAdapter
    }


    fun showEmpty() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.gone()
        progressLayout.emptyLayout.visible()
    }

    fun showProgress() = with(binding) {
        progressLayout.mainLayout.visible()
        progressLayout.progressAnimation.visible()
        progressLayout.emptyLayout.gone()
    }

    fun showErrorEmpty(message: String) = with(binding) {
        binding.progressLayout.progressAnimation.gone()
        binding.progressLayout.emptyLayout.visible()
        binding.progressLayout.mainLayout.visible()
        binding.progressLayout.emptyTitle.text = message
    }

    override fun onDestroyView() {
        super.onDestroyView()
        // after this, NEVER use binding
    }

}