package org.apache.cordova.firebase;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessaging;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;

public class FirebasePlugin extends CordovaPlugin {

	private FirebaseAnalytics mFirebaseAnalytics;
	protected static final String KEY = "badge";
	private static boolean inBackground = true;
	private static ArrayList<Bundle> notificationStack = null;
	private static CallbackContext notificationCallbackContext;
	private static CallbackContext tokenRefreshCallbackContext;

	@Override
	protected void pluginInitialize() {
		final Context context = this.cordova.getActivity().getApplicationContext();
		this.cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				mFirebaseAnalytics = FirebaseAnalytics.getInstance(context);
			}
		});
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("getToken")) {
			this.getToken(callbackContext);
			return true;
		} else if (action.equals("setBadgeNumber")) {
			this.setBadgeNumber(callbackContext, args.getInt(0));
			return true;
		} else if (action.equals("getBadgeNumber")) {
			this.getBadgeNumber(callbackContext);
			return true;
		} else if (action.equals("subscribe")) {
			this.subscribe(callbackContext, args.getString(0));
			return true;
		} else if (action.equals("unsubscribe")) {
			this.unsubscribe(callbackContext, args.getString(0));
			return true;
		} else if (action.equals("onNotificationOpen")) {
			this.onNotificationOpen(callbackContext);
			return true;
		} else if (action.equals("onTokenRefresh")) {
			this.onTokenRefresh(callbackContext);
			return true;
		} else if (action.equals("logEvent")) {
			this.logEvent(callbackContext, args.getString(0), args.getJSONObject(1));
			return true;
		} else if (action.equals("setUserId")) {
			this.setUserId(callbackContext, args.getString(0));
			return true;
		} else if (action.equals("setUserProperty")) {
			this.setUserProperty(callbackContext, args.getString(0), args.getString(1));
			return true;
		} else if (action.equals("clearAll")) {
			Context ctx = this.cordova.getActivity().getApplicationContext();
			NotificationManager nm = (NotificationManager) ctx.getSystemService(ctx.NOTIFICATION_SERVICE);
			nm.cancelAll();
			return true;
		}
		return false;
	}

	@Override
	public void onPause(boolean multitasking) {
		FirebasePlugin.inBackground = true;
	}

	@Override
	public void onResume(boolean multitasking) {
		FirebasePlugin.inBackground = false;
	}

	@Override
	public void onReset() {
		FirebasePlugin.notificationCallbackContext = null;
		FirebasePlugin.tokenRefreshCallbackContext = null;
	}

	private void onNotificationOpen(final CallbackContext callbackContext) {
		FirebasePlugin.notificationCallbackContext = callbackContext;
		if (FirebasePlugin.notificationStack != null) {
			for (Bundle bundle : FirebasePlugin.notificationStack) {
				FirebasePlugin.sendNotification(bundle);
			}
			FirebasePlugin.notificationStack.clear();
		}
	}

	private void onTokenRefresh(final CallbackContext callbackContext) {
		FirebasePlugin.tokenRefreshCallbackContext = callbackContext;
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					String currentToken = FirebaseInstanceId.getInstance().getToken();
					if (currentToken != null) {
						FirebasePlugin.sendToken(currentToken);
					}
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	public static void sendNotification(Bundle bundle) {
		if (!FirebasePlugin.hasNotificationsCallback()) {
			if (FirebasePlugin.notificationStack == null) {
				FirebasePlugin.notificationStack = new ArrayList<Bundle>();
			}
			notificationStack.add(bundle);
			return;
		}
		final CallbackContext callbackContext = FirebasePlugin.notificationCallbackContext;
		if (callbackContext != null && bundle != null) {
			JSONObject json = new JSONObject();
			Set<String> keys = bundle.keySet();
			for (String key : keys) {
				try {
					json.put(key, bundle.get(key));
				} catch (JSONException e) {
					callbackContext.error(e.getMessage());
					return;
				}
			}
			PluginResult pluginresult = new PluginResult(PluginResult.Status.OK, json);
			pluginresult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginresult);
		}
	}

	public static void sendToken(String token) {
		if (FirebasePlugin.tokenRefreshCallbackContext == null) {
			return;
		}
		final CallbackContext callbackContext = FirebasePlugin.tokenRefreshCallbackContext;
		if (callbackContext != null && token != null) {
			PluginResult pluginresult = new PluginResult(PluginResult.Status.OK, token);
			pluginresult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginresult);
		}
	}

	public static boolean inBackground() {
		return FirebasePlugin.inBackground;
	}

	public static boolean hasNotificationsCallback() {
		return FirebasePlugin.notificationCallbackContext != null;
	}

	@Override
	public void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		FirebasePlugin.sendNotification(intent.getExtras());
	}

	private void getToken(final CallbackContext callbackContext) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					String token = FirebaseInstanceId.getInstance().getToken();
					callbackContext.success(token);
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void setBadgeNumber(final CallbackContext callbackContext, final int number) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					Context context = cordova.getActivity();
					SharedPreferences.Editor editor = context.getSharedPreferences(KEY, Context.MODE_PRIVATE).edit();
					editor.putInt(KEY, number);
					editor.apply();
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void getBadgeNumber(final CallbackContext callbackContext) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					Context context = cordova.getActivity();
					SharedPreferences settings = context.getSharedPreferences(KEY, Context.MODE_PRIVATE);
					int number = settings.getInt(KEY, 0);
					callbackContext.success(number);
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void subscribe(final CallbackContext callbackContext, final String topic) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					FirebaseMessaging.getInstance().subscribeToTopic(topic);
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void unsubscribe(final CallbackContext callbackContext, final String topic) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					FirebaseMessaging.getInstance().unsubscribeFromTopic(topic);
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void logEvent(final CallbackContext callbackContext, final String name, final JSONObject params) throws JSONException {
		final Bundle bundle = new Bundle();
		Iterator iter = params.keys();
		while (iter.hasNext()) {
			String key = (String) iter.next();
			Object value = params.get(key);

			if (value instanceof Integer || value instanceof Double) {
				bundle.putFloat(key, ((Number) value).floatValue());
			} else {
				bundle.putString(key, value.toString());
			}
		}

		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					mFirebaseAnalytics.logEvent(name, bundle);
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void setUserId(final CallbackContext callbackContext, final String id) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					mFirebaseAnalytics.setUserId(id);
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}

	private void setUserProperty(final CallbackContext callbackContext, final String name, final String value) {
		cordova.getThreadPool().execute(new Runnable() {
			public void run() {
				try {
					mFirebaseAnalytics.setUserProperty(name, value);
					callbackContext.success();
				} catch (Exception e) {
					callbackContext.error(e.getMessage());
				}
			}
		});
	}
}