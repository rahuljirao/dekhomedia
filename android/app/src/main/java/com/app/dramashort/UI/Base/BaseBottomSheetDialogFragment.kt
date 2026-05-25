package com.app.dramashort.UI.Base

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.viewbinding.ViewBinding
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.app.dramashort.R
import com.google.android.material.bottomsheet.BottomSheetBehavior

abstract class BaseBottomSheetDialogFragment<VB : ViewBinding>(
    private val bindingInflater: (LayoutInflater, ViewGroup?, Boolean) -> VB
) : BottomSheetDialogFragment() {

    private var _binding: VB? = null

    val binding: VB
        get() = _binding
            ?: throw IllegalStateException("Binding accessed outside of view lifecycle")

    open fun getThemeStyle(): Int = R.style.MyTransparentBottomSheetDialogTheme
    open fun getInitialBottomSheetState(): Int = BottomSheetBehavior.STATE_HALF_EXPANDED

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return BottomSheetDialog(requireContext(), getThemeStyle()).apply {
            setOnShowListener {
                val bottomSheet =
                    findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)
                bottomSheet?.let {
                    BottomSheetBehavior.from(it).state = getInitialBottomSheetState()
                }
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = bindingInflater(inflater, container, false)
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null   // prevent memory leak
    }
}


//abstract class BaseBottomSheetDialogFragment<VB : ViewBinding>(
//    private val bindingInflater: (LayoutInflater, ViewGroup?, Boolean) -> VB,
//) : BottomSheetDialogFragment() {
//
////    private var _binding: VB? = null
////    val binding get() = _binding!!
//
//
//    private var _binding: VB? = null
//    val binding: VB
//        get() = _binding
//            ?: throw IllegalStateException("Binding accessed outside of view lifecycle")
//
//
//    open fun getThemeStyle(): Int = R.style.MyTransparentBottomSheetDialogTheme
//    open fun getInitialBottomSheetState(): Int = BottomSheetBehavior.STATE_HALF_EXPANDED
//
//    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
//        return BottomSheetDialog(requireContext(), getThemeStyle()).apply {
//
//            setOnShowListener {
//                val bottomSheet = findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)
//                bottomSheet?.let {
//                    BottomSheetBehavior.from(it).state = getInitialBottomSheetState()
//                }
//            }
//        }
//    }
//
//
//    override fun onCreateView(
//        inflater: LayoutInflater,
//        container: ViewGroup?,
//        savedInstanceState: Bundle?,
//    ): View {
//        _binding = bindingInflater(inflater, container, false)
//        return binding.root
//    }
//
//    override fun onDestroyView() {
//        super.onDestroyView()
//        _binding = null // Prevent memory leak
//    }
//}
