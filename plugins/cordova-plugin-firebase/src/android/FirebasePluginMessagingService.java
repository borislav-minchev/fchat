package org.apache.cordova.firebase;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import com.favo360.chat.R;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class FirebasePluginMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        boolean isAppInBackground = FirebasePlugin.inBackground();
        sendNotification(remoteMessage.getData(), isAppInBackground);
    }

    private void sendNotification(Map<String, String> notification, boolean isAppInBackground) {
        Bundle bundle = new Bundle();
        for (String key : notification.keySet()) {
            bundle.putString(key, notification.get(key));
        }
        if (isAppInBackground) {
            String userId = notification.get("user");
            String currentUserId = FirebasePluginMessagingService.this.getSharedPreferences("shared_preferences", MODE_PRIVATE).getString("userId", "");
            if (userId == null || !userId.equals(currentUserId)) {
                Intent intent = new Intent(this, OnNotificationOpenReceiver.class);
                intent.putExtras(bundle);
                PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 360, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
                Bitmap bitmap = getBitmapFromURL(notification.get("avatar"));
                String pushTitle;
                if (notification.get("title") != null) {
                    pushTitle = notification.get("title");
                } else {
                    pushTitle = notification.get("message");
                }
                String pushText = notification.get("text");
                Notification.Builder builder = new Notification.Builder(this);
                builder.setSmallIcon(R.drawable.push_icon);
                if (Build.VERSION.SDK_INT >= 21) {
                    builder.setColor(1196178);
                }
                builder.setLargeIcon(bitmap);
                builder.setContentTitle(pushTitle);
                builder.setContentText(pushText);
                builder.setAutoCancel(true);
                builder.setSound(defaultSoundUri);
                builder.setLights(1196178, 1000, 1000);
                builder.setVibrate(new long[]{0, 500});
                builder.setContentIntent(pendingIntent);

                Notification notif = builder.build();
                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                /*
                if (Build.VERSION.SDK_INT >= 23) {
                    StatusBarNotification[]	notifs = notificationManager.getActiveNotifications();
                    for (StatusBarNotification n : notifs) {
                        if (n.getId() == 360) {
                            builder.setSound(null);
                            builder.setVibrate(null);
                            break;
                        }
                    }
                }
                */
                notificationManager.notify(360, notif);
            }
        } else {
            bundle.putBoolean("tap", false);
            FirebasePlugin.sendNotification(bundle);
        }
    }

    public Bitmap getBitmapFromURL(String strURL) {
        try {
            URL url = new URL(strURL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap myBitmap = BitmapFactory.decodeStream(input);
            return myBitmap;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}