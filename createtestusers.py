#%%

import requests, names



headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
}
data = {
  'grant_type': 'client_credentials',
  'client_id': 'admin-cli',
  'client_secret': 'fdac5f72-1c59-497b-8b25-3c80d5fe4877'
}
response = requests.post('https://dev-kc.interop.community/auth/realms/master/protocol/openid-connect/token', headers=headers, data=data)

bearer = response.json().get('access_token')
print(response.json())




#%%
### CREATE TEST users
url = 'https://dev-kc.interop.community/auth/admin/realms/iol/users'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {bearer}',
}

responses = [
 requests.post(url, headers=headers, json={
	"username": f"testuser{i}",
	"lastName": "loadtest",
	"firstName": names.get_first_name(),
	"email": f"test{i}@ioi",
    "emailVerified": True,
	"enabled": True,
	"credentials":[{
		"type": "password",
		"value": "test",
		"temporary": False
	}]
}
) for i in range(1,101)
]

# %%
### DELETE testusers
response =  requests.get(url+'?lastName=loadtest', headers=headers, )
responses = [requests.delete(f"{url}/{i['id']}", headers=headers) for i in response.json()]



# %%
