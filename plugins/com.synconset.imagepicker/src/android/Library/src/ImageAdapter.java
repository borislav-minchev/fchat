package com.synconset;

import android.app.AlertDialog;
import android.app.LoaderManager;
import android.app.LoaderManager.LoaderCallbacks;
import android.content.Context;
import android.content.CursorLoader;
import android.content.DialogInterface;
import android.content.Loader;
import android.database.Cursor;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.MediaStore.Images.Thumbnails;
import android.util.SparseBooleanArray;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AbsListView.OnScrollListener;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.AdapterView.OnItemClickListener;
import android.provider.MediaStore.Images.Media;
import com.favo360.chat.R;
import com.google.firebase.crash.FirebaseCrash;
import com.synconset.interfaces.ImageClickCallback;
import com.synconset.models.SquareImageView;

import java.util.ArrayList;

public class ImageAdapter extends BaseAdapter implements OnItemClickListener, OnScrollListener, LoaderCallbacks<Cursor> {

    private final ImageFetcher fetcher = new ImageFetcher();
    private Context context;
    private Cursor imagecursor, actualimagecursor;
    private int image_column_index, image_column_orientation;
    private int maxImageCount, maxImages;
    private static final int CURSORLOADER_THUMBS = 0;
    private static final int CURSORLOADER_REAL = 1;
    private final int selectedColor = 0xff32b2e1;
    private boolean shouldRequestThumb = true;
    private int colWidth;
    private int actual_image_column_index, orientation_column_index;
    private final SparseBooleanArray checkStatus = new SparseBooleanArray();
    private ImageClickCallback imageClickCallback;

    public ImageAdapter(MultiImageChooserActivity activity, int maxImg, int columnWidth) {
        context = activity;
        imageClickCallback = activity;
        maxImageCount = maxImg;
        maxImages = maxImg;
        colWidth = columnWidth;
        LoaderManager.enableDebugLogging(false);
        activity.getLoaderManager().initLoader(CURSORLOADER_THUMBS, null, this);
        activity.getLoaderManager().initLoader(CURSORLOADER_REAL, null, this);
        GridView gridView = (GridView) activity.findViewById(R.id.gridview);
        gridView.setOnItemClickListener(this);
        gridView.setOnScrollListener(this);
        gridView.setAdapter(this);
    }

    @Override
    public void onItemClick(AdapterView<?> arg0, View view, int position, long id) {
        String name = getImageName(position);
        int rotation = getImageRotation(position);
        if (name == null) {
            return;
        }
        boolean isChecked = !isChecked(position);
        if (maxImages == 0 && isChecked) {
            isChecked = false;
            AlertDialog.Builder dialog = new AlertDialog.Builder(context);
            dialog.setTitle("Maximum " + maxImageCount + " Photos");
            dialog.setMessage("You can only select " + maxImageCount + " photos resizeImagesTask a time.");
            dialog.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                public void onClick(DialogInterface dialog, int which) {
                    dialog.cancel();
                }
            });
            dialog.create().show();
        } else if (isChecked) {
            MultiImageChooserActivity.fileNames.put(name, rotation);
            maxImages--;
            ImageView imageView = (ImageView) view;
            imageView.setImageAlpha(128);
            view.setBackgroundColor(selectedColor);
        } else {
            MultiImageChooserActivity.fileNames.remove(name);
            maxImages++;
            ImageView imageView = (ImageView) view;
            imageView.setImageAlpha(255);
            view.setBackgroundColor(Color.TRANSPARENT);
        }
        checkStatus.put(position, isChecked);
        imageClickCallback.onImageClick();
    }

    @Override
    public void onScrollStateChanged(AbsListView view, int scrollState) {
        if (scrollState == SCROLL_STATE_IDLE) {
            shouldRequestThumb = true;
            this.notifyDataSetChanged();
        }
    }

    @Override
    public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
    }

    private String getImageName(int position) {
        actualimagecursor.moveToPosition(position);
        String name = null;
        try {
            name = actualimagecursor.getString(actual_image_column_index);
        } catch (Exception e) {
            FirebaseCrash.log("Exception :" + e.getMessage());
        }
        return name;
    }

    private int getImageRotation(int position) {
        actualimagecursor.moveToPosition(position);
        int rotation = 0;
        try {
            rotation = actualimagecursor.getInt(orientation_column_index);
        } catch (Exception e) {
            FirebaseCrash.log("Exception :" + e.getMessage());
        }
        return rotation;
    }

    private boolean isChecked(int position) {
        return checkStatus.get(position);
    }

    public int getCount() {
        if (imagecursor != null) {
            return imagecursor.getCount();
        } else {
            return 0;
        }
    }

    public Object getItem(int position) {
        return position;
    }

    public long getItemId(int position) {
        return position;
    }

    // create a new ImageView for each item referenced by the Adapter
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            ImageView temp = new SquareImageView(context);
            temp.setScaleType(ImageView.ScaleType.CENTER_CROP);
            convertView = temp;
        }
        ImageView imageView = (ImageView) convertView;
        imageView.setImageBitmap(null);
        if (!imagecursor.moveToPosition(position)) {
            return imageView;
        }
        if (image_column_index == -1) {
            return imageView;
        }
        final int id = imagecursor.getInt(image_column_index);
        final int rotate = imagecursor.getInt(image_column_orientation);
        if (isChecked(position)) {
            imageView.setImageAlpha(128);
            imageView.setBackgroundColor(selectedColor);
        } else {
            imageView.setImageAlpha(255);
            imageView.setBackgroundColor(Color.TRANSPARENT);
        }
        if (shouldRequestThumb) {
            fetcher.fetch(id, imageView, colWidth, rotate);
        }
        return imageView;
    }

    @Override
    public Loader<Cursor> onCreateLoader(int cursorID, Bundle args) {
        ArrayList<String> img = new ArrayList<String>();
        switch (cursorID) {
            case CURSORLOADER_THUMBS:
                img.add(Media._ID);
                img.add(Media.ORIENTATION);
                break;

            case CURSORLOADER_REAL:
                img.add(Thumbnails.DATA);
                img.add(Media.ORIENTATION);
                break;
        }

        return new CursorLoader(context, Media.EXTERNAL_CONTENT_URI,
                img.toArray(new String[img.size()]), null, null,
                "DATE_MODIFIED DESC");
    }

    @Override
    public void onLoadFinished(Loader<Cursor> loader, Cursor cursor) {
        if (cursor == null) {
            return;
        }
        switch (loader.getId()) {
            case CURSORLOADER_THUMBS:
                imagecursor = cursor;
                image_column_index = imagecursor.getColumnIndex(Media._ID);
                image_column_orientation = imagecursor.getColumnIndex(Media.ORIENTATION);
                this.notifyDataSetChanged();
                break;

            case CURSORLOADER_REAL:
                actualimagecursor = cursor;
                actual_image_column_index = actualimagecursor.getColumnIndexOrThrow(Media.DATA);
                orientation_column_index = actualimagecursor.getColumnIndexOrThrow(Media.ORIENTATION);
                break;
        }
    }

    @Override
    public void onLoaderReset(Loader<Cursor> loader) {
        switch (loader.getId()) {
            case CURSORLOADER_THUMBS:
                imagecursor = null;
                break;

            case CURSORLOADER_REAL:
                actualimagecursor = null;
                break;
        }
    }
}
