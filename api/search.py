from requests_aws4auth import AWS4Auth
import boto3
import requests
import json
import itertools

elasticSearchUrl = "https://vpc-cr-es-domain-dev-qzwrhzyisuyfxpx5vzad5buicq.us-east-1.es.amazonaws.com/"
region = "us-east-1"

service = "es"
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

def _search(body):
    print(body)
    url = elasticSearchUrl + body['index'] + "/_search"
    response = requests.get(url, auth=awsauth, json=body['query'])
    return response.json()
