package com.synconset;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.provider.MediaStore;
import android.widget.ImageView;
import com.google.firebase.crash.FirebaseCrash;
import com.synconset.asynctasks.BitmapFetcherTask;
import com.synconset.interfaces.FetcherTaskCallback;
import com.synconset.models.DownloadedDrawable;
import java.lang.ref.SoftReference;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.RejectedExecutionException;

public class ImageFetcher implements FetcherTaskCallback {

    private int colWidth;
    private long origId;
    private static final int HARD_CACHE_CAPACITY = 100;
    private final static ConcurrentHashMap<Integer, SoftReference<Bitmap>> sSoftBitmapCache =
            new ConcurrentHashMap<Integer, SoftReference<Bitmap>>(HARD_CACHE_CAPACITY / 2);

    public void fetch(Integer id, ImageView imageView, int colWidth, int rotate) {
        this.colWidth = colWidth;
        this.origId = id;
        Bitmap bitmap = getBitmapFromCache(id);
        if (bitmap == null) {
            forceDownload(id, imageView, rotate);
        } else {
            cancelPotentialDownload(id, imageView);
            imageView.setImageBitmap(bitmap);
        }
    }

    private void forceDownload(Integer position, ImageView imageView, int rotate) {
        if (position == null) {
            imageView.setImageDrawable(null);
            return;
        }
        if (cancelPotentialDownload(position, imageView)) {
            BitmapFetcherTask task = new BitmapFetcherTask(this, imageView.getContext(), imageView, rotate);
            DownloadedDrawable downloadedDrawable = new DownloadedDrawable(task, origId);
            imageView.setImageDrawable(downloadedDrawable);
            imageView.setMinimumHeight(colWidth);
            try {
                task.execute(position);
            } catch (RejectedExecutionException e) {
                FirebaseCrash.log("RejectedExecutionException :" + e.getMessage());
            }
        }
    }

    /**
     * Returns true if the current download has been canceled or if there was no
     * download in progress on this image view. Returns false if the download in
     * progress deals with the same url. The download is not stopped in that
     * case.
     */
    private static boolean cancelPotentialDownload(Integer position, ImageView imageView) {
        BitmapFetcherTask bitmapDownloaderTask = BitmapFetcherTask.getBitmapDownloaderTask(imageView);
        long origId = getOrigId(imageView);
        if (bitmapDownloaderTask != null) {
            Integer bitmapPosition = bitmapDownloaderTask.position;
            if ((bitmapPosition == null) || (!bitmapPosition.equals(position))) {
                MediaStore.Images.Thumbnails.cancelThumbnailRequest(imageView.getContext().getContentResolver(), origId, 12345);
                bitmapDownloaderTask.cancel(true);
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * @param imageView Any imageView
     * @return Retrieve the currently active download task (if any) associated
     * with this imageView. null if there is no such task.
     */


    private static long getOrigId(ImageView imageView) {
        if (imageView != null) {
            Drawable drawable = imageView.getDrawable();
            if (drawable instanceof DownloadedDrawable) {
                DownloadedDrawable downloadedDrawable = (DownloadedDrawable) drawable;
                return downloadedDrawable.getOrigId();
            }
        }
        return -1;
    }

    private Bitmap getBitmapFromCache(Integer position) {
        // First try the hard reference cache
        synchronized (sHardBitmapCache) {
            final Bitmap bitmap = sHardBitmapCache.get(position);
            if (bitmap != null) {
                // Bitmap found in hard cache
                // Move element to first position, so that it is removed last
                return bitmap;
            }
        }

        // Then try the soft reference cache
        SoftReference<Bitmap> bitmapReference = sSoftBitmapCache.get(position);
        if (bitmapReference != null) {
            final Bitmap bitmap = bitmapReference.get();
            if (bitmap != null) {
                // Bitmap found in soft cache
                return bitmap;
            } else {
                // Soft reference has been Garbage Collected
                sSoftBitmapCache.remove(position);
            }
        }

        return null;
    }

    // Hard cache, with a fixed maximum capacity and a life duration
    private final HashMap<Integer, Bitmap> sHardBitmapCache = new LinkedHashMap<Integer, Bitmap>(HARD_CACHE_CAPACITY / 2, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(LinkedHashMap.Entry<Integer, Bitmap> eldest) {
            if (size() > HARD_CACHE_CAPACITY) {
                // Entries push-out of hard reference cache are transferred to
                // soft reference cache
                sSoftBitmapCache.put(eldest.getKey(), new SoftReference<Bitmap>(eldest.getValue()));
                return true;
            } else
                return false;
        }
    };

    private void addBitmapToCache(Integer position, Bitmap bitmap) {
        if (bitmap != null) {
            synchronized (sHardBitmapCache) {
                sHardBitmapCache.put(position, bitmap);
            }
        }
    }

    private void clearCache() {
        sHardBitmapCache.clear();
        sSoftBitmapCache.clear();
    }

    @Override
    public void onClearCache() {
        clearCache();
    }

    @Override
    public void onAddBitmapToCache(Integer position, Bitmap bitmap) {
        addBitmapToCache(position, bitmap);
    }
}