package com.synconset;

import android.app.ActionBar;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnCancelListener;
import android.content.DialogInterface.OnDismissListener;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Point;
import android.os.Bundle;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.TextView;
import com.favo360.chat.R;
import com.synconset.asynctasks.ResizeImagesTask;
import com.synconset.interfaces.ImageClickCallback;
import com.synconset.interfaces.ResizeImagesCallback;
import java.util.HashMap;
import java.util.Map;

public class MultiImageChooserActivity extends Activity implements ImageClickCallback, ResizeImagesCallback {

    public static final Map<String, Integer> fileNames = new HashMap<String, Integer>();
    private static final int NOLIMIT = -1;
    private static final String MAX_IMAGES_KEY = "MAX_IMAGES";
    private ResizeImagesTask resizeImagesTask;
    private ProgressDialog progress;
    private View abDoneView;
    private View abDiscardView;
    private TextView doneBtnTv;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.multiselectorgrid);
        fileNames.clear();
        int maxImages = getIntent().getIntExtra(MAX_IMAGES_KEY, NOLIMIT);
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int colWidth = width / 4;
        new ImageAdapter(this, maxImages, colWidth);
        setupHeader();
        updateAcceptButton();
        setProgressDialog();
    }

    private void setProgressDialog() {
        progress = new ProgressDialog(this);
        progress.setTitle(getString(R.string.multi_image_picker_processing_images_title));
        progress.setMessage(getString(R.string.multi_image_picker_processing_images_message));
        progress.setCancelable(true);
        progress.setOnCancelListener(new OnCancelListener() {

            @Override
            public void onCancel(DialogInterface dialog) {
                cancelDialog();
            }
        });
        progress.setOnDismissListener(new OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                cancelDialog();
            }
        });
    }

    private void cancelDialog() {
        progress.dismiss();
        resizeImagesTask.cancel(true);
        abDiscardView.setEnabled(true);
        abDoneView.setEnabled(true);
    }

    private void cancelClicked() {
        setResult(RESULT_CANCELED);
        finish();
    }

    private void selectClicked() {
        abDiscardView.setEnabled(false);
        abDoneView.setEnabled(false);
        progress.show();
        if (fileNames.isEmpty()) {
            setResult(RESULT_CANCELED);
            progress.dismiss();
            finish();
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_NOSENSOR); //prevent orientation changes during processing
            resizeImagesTask = new ResizeImagesTask(this);
            resizeImagesTask.execute(fileNames.entrySet());
        }
    }

    private void updateAcceptButton() {
        if (abDoneView != null) {
            if (fileNames.size() != 0) {
                doneBtnTv.setTextColor(getResources().getColor(android.R.color.white));
                abDoneView.setEnabled(true);
            } else {
                doneBtnTv.setTextColor(getResources().getColor(android.R.color.darker_gray));
                abDoneView.setEnabled(false);
            }
        }
    }

    private void setupHeader() {
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        View customActionBarView = inflater.inflate(R.layout.actionbar_custom_view_done_discard, null);
        abDoneView = customActionBarView.findViewById(R.id.actionbar_done);
        abDoneView.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                selectClicked();
            }
        });
        doneBtnTv = (TextView) abDoneView.findViewById(R.id.actionbar_done_textview);
        abDiscardView = customActionBarView.findViewById(R.id.actionbar_discard);
        abDiscardView.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                cancelClicked();
            }
        });

        // Show the custom action bar view and hide the normal Home icon and title.
        ActionBar actionBar = getActionBar();
        if (actionBar != null) {
            actionBar.setDisplayOptions(
                    ActionBar.DISPLAY_SHOW_CUSTOM,
                    ActionBar.DISPLAY_SHOW_CUSTOM
                            | ActionBar.DISPLAY_SHOW_HOME
                            | ActionBar.DISPLAY_SHOW_TITLE
            );
            actionBar.setCustomView(customActionBarView, new ActionBar.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
            ));
        }
    }

    @Override
    public void onImageClick() {
        updateAcceptButton();
    }

    @Override
    public void onResizeImagesResult(boolean resultOk, Intent data) {
        if (resultOk) {
            setResult(RESULT_OK, data);
        } else {
            setResult(RESULT_CANCELED, data);
        }
        progress.dismiss();
        finish();
    }
}