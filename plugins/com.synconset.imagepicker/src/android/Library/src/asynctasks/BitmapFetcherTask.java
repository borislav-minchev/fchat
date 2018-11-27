package com.synconset.asynctasks;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.provider.MediaStore.Images.Thumbnails;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import com.google.firebase.crash.FirebaseCrash;
import com.synconset.models.DownloadedDrawable;
import com.synconset.interfaces.FetcherTaskCallback;

import java.lang.ref.WeakReference;

public class BitmapFetcherTask extends AsyncTask<Integer, Void, Bitmap> {

    private FetcherTaskCallback fetcherTaskCallback;
    public Integer position;
    private final WeakReference<ImageView> imageViewReference;
    private final Context mContext;
    private final int rotate;

    public BitmapFetcherTask(FetcherTaskCallback callback, Context context, ImageView imageView, int rotate) {
        fetcherTaskCallback = callback;
        imageViewReference = new WeakReference<ImageView>(imageView);
        mContext = context;
        this.rotate = rotate;
    }

    @Override
    protected Bitmap doInBackground(Integer... params) {
        try {
            position = params[0];
            if (isCancelled()) {
                return null;
            }
            Bitmap thumb = Thumbnails.getThumbnail(mContext.getContentResolver(), position, 12345, Thumbnails.MINI_KIND, null);
            if (isCancelled()) {
                return null;
            }
            if (thumb == null) {
                return null;
            } else {
                if (isCancelled()) {
                    return null;
                } else {
                    if (rotate != 0) {
                        Matrix matrix = new Matrix();
                        matrix.setRotate(rotate);
                        thumb = Bitmap.createBitmap(thumb, 0, 0, thumb.getWidth(), thumb.getHeight(), matrix, true);
                    }
                    return thumb;
                }
            }
        } catch (OutOfMemoryError error) {
            fetcherTaskCallback.onClearCache();
            FirebaseCrash.log("OutOfMemoryError" + error.getMessage());
            return null;
        } catch (RuntimeException re) {
            FirebaseCrash.log("Runtime Exception :" + re.getMessage());
            return null;
        }
    }

    @Override
    protected void onPostExecute(Bitmap bitmap) {
        if (isCancelled()) {
            bitmap = null;
        }
        fetcherTaskCallback.onAddBitmapToCache(position, bitmap);
        ImageView imageView = imageViewReference.get();
        BitmapFetcherTask bitmapDownloaderTask = getBitmapDownloaderTask(imageView);
        if (this == bitmapDownloaderTask) {
            imageView.setImageBitmap(bitmap);
            Animation anim = AnimationUtils.loadAnimation(imageView.getContext(), android.R.anim.fade_in);
            imageView.setAnimation(anim);
            anim.start();
        }
    }

    public static BitmapFetcherTask getBitmapDownloaderTask(ImageView imageView) {
        if (imageView != null) {
            Drawable drawable = imageView.getDrawable();
            if (drawable instanceof DownloadedDrawable) {
                DownloadedDrawable downloadedDrawable = (DownloadedDrawable) drawable;
                return downloadedDrawable.getBitmapDownloaderTask();
            }
        }
        return null;
    }
}