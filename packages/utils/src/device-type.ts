const MOBILE_REGEX =
	/(?:phone|windows\s+phone|ipod|blackberry|(?:android|bb\d+|meego|silk|googlebot) .+? mobile|palm|windows\s+ce|opera mini|avantgo|mobilesafari|docomo|KAIOS)/i;
const TABLET_REGEX =
	/(?:ipad|playbook|(?:android|bb\d+|meego|silk)(?! .+? mobile))/i;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * A helper function to get the device type from user-agent
 *
 * @param userAgent The user-agent string
 */
export function getDeviceType(userAgent?: string | null): DeviceType {
	if (typeof userAgent === 'string') {
		if (MOBILE_REGEX.test(userAgent)) {
			return 'mobile';
		}

		if (TABLET_REGEX.test(userAgent)) {
			return 'tablet';
		}
	}

	// Everything else not matched above will be considered as desktop
	return 'desktop';
}
