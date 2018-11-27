package com.synconset.models;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import com.synconset.asynctasks.BitmapFetcherTask;
import java.lang.ref.WeakReference;

public class DownloadedDrawable extends ColorDrawable {

    private final WeakReference<BitmapFetcherTask> bitmapDownloaderTaskReference;
    private final long origId;

    public DownloadedDrawable(BitmapFetcherTask bitmapDownloaderTask, long origId) {
        super(Color.TRANSPARENT);
        bitmapDownloaderTaskReference = new WeakReference<BitmapFetcherTask>(bitmapDownloaderTask);
        this.origId = origId;
    }

    public long getOrigId() {
        return origId;
    }


    public BitmapFetcherTask getBitmapDownloaderTask() {
        return bitmapDownloaderTaskReference.get();
    }
}
