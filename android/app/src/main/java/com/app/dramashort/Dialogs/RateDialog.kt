package com.app.dramashort.Dialogs

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.app.dramashort.R
import com.app.dramashort.databinding.DialogRateUsFeedbackBinding
import com.fuzzproductions.ratingbar.RatingBar
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class RateDialog : BottomSheetDialogFragment() {


    companion object {
        val TAG = "FeedbackDialog"
    }

    lateinit var binding: DialogRateUsFeedbackBinding

    interface FeedbackListener {
        fun onFeedbackSubmitted(rating: Int, feedback: String?)
        fun onDismissed()
    }

    private var feedbackListener: FeedbackListener? = null

    fun setFeedbackListener(listener: FeedbackListener) {
        this.feedbackListener = listener
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?,
    ): View {
        binding = DialogRateUsFeedbackBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return BottomSheetDialog(requireActivity(), R.style.MyTransparentBottomSheetDialogTheme)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupViews()
        setupRatingBar()
        setupClickListeners()
    }

    private fun setupViews() {
        binding.btnBack.setOnClickListener {
            dismiss()
        }
        binding.clFeedBackSubmit.visibility = View.GONE // Hide feedback form initially
        binding.ratingBar.setEmptyDrawable(R.drawable.ic_star_empty)
        binding.ratingBar.setFilledDrawable(R.drawable.ic_star_fill)
    }

    private fun setupRatingBar() {
        binding.ratingBar.onRatingBarChangeListener = object : RatingBar.OnRatingBarChangeListener {
            override fun onRatingChanged(
                ratingBar: RatingBar?,
                rating: Float,
                fromUser: Boolean,
            ) {
                if (rating < 4) {
                    // Show feedback form for ratings less than 4 stars
                    binding.clRatingSubmit.visibility = View.GONE
                    binding.clFeedBackSubmit.visibility = View.VISIBLE
                } else {
                    // Hide feedback form for high ratings
                    binding.clRatingSubmit.visibility = View.VISIBLE
                    binding.clFeedBackSubmit.visibility = View.GONE
                }
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnRatingSubmit.setOnClickListener {
            submitRating(binding.ratingBar.rating.toInt(), null)
        }

        binding.btnFeedbackSubmit.setOnClickListener {
//            val feedback = binding.edtFeedback.text?.toString()?.takeIf { it.isNotBlank() }
//            submitRating(binding.ratingBar.rating.toInt(), feedback)
        }

        binding.btnExit.setOnClickListener {
            feedbackListener?.onDismissed()
            dismiss()
        }
    }

    private fun submitRating(rating: Int, feedback: String?) {
        binding.progressBar1.visibility = View.VISIBLE
        binding.btnFeedbackSubmit.isEnabled = false
        binding.btnRatingSubmit.isEnabled = false

        // Simulate network request
        view?.postDelayed({
            feedbackListener?.onFeedbackSubmitted(rating, feedback)
            dismiss()
        }, 1500)
    }
}