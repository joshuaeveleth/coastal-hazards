package gov.usgs.cida.coastalhazards.rest.security;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.PreMatching;

import gov.usgs.cida.auth.client.AuthClientSingleton;
import gov.usgs.cida.auth.client.IAuthClient;
import gov.usgs.cida.auth.ws.rs.filter.AbstractTokenBasedSecurityContextFilter;
 
@PreMatching
@Priority(Priorities.AUTHENTICATION)
public class CoastalHazardsTokenBasedSecurityFilter extends AbstractTokenBasedSecurityContextFilter {
	public static final String CIDA_AUTHORIZED_ROLE = "CIDA_AUTHORIZED";
	public static final String CCH_ADMIN_ROLE = "CCH_ADMIN";

	public static final List<String> ACCEPTED_ROLES = Arrays.asList(new String[] { CIDA_AUTHORIZED_ROLE });
	
	@Override
	public IAuthClient getAuthClient() {
		return AuthClientSingleton.getAuthClient();
	}

	@Override
	public List<String> getAdditionalRoles() {
		return ACCEPTED_ROLES; //This will reapply the roles if the session is authenticated
	}

	@Override
	public List<String> getAuthorizedRoles() {
		return ACCEPTED_ROLES; //Only this role, this role will be set by the token service on auth
	}
}