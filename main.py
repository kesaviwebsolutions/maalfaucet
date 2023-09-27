import tweepy
from flask import Flask, request, render_template, redirect, url_for
from web3 import Web3
import threading
import time

# Initialize Flask app
app = Flask(__name__)

# Define your custom EVM blockchain RPC URL and chain ID
custom_chain_rpc_url = "https://node1.maalscan.io"
chain_id = 880

# Initialize Web3 provider
w3 = Web3(Web3.HTTPProvider(custom_chain_rpc_url))

# Twitter API credentials
consumer_key = "YOUR_CONSUMER_KEY"
consumer_secret = "YOUR_CONSUMER_SECRET"
access_token = "YOUR_ACCESS_TOKEN"
access_token_secret = "YOUR_ACCESS_TOKEN_SECRET"

# Initialize Tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
twitter_api = tweepy.API(auth)

# Dictionary to store user claims and timestamps
user_claims = {}

# Function to check if a user can claim tokens
def can_claim_tokens(user_address):
    current_time = time.time()
    last_claim_time = user_claims.get(user_address, 0)
    return current_time - last_claim_time >= 24 * 60 * 60  # 24 hours in seconds

# Endpoint for the UI
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        user_address = request.form.get("user_address")
        tweet_url = request.form.get("tweet_url")

        # Check if the tweet is valid
        if validate_tweet(user_address, tweet_url):
            if can_claim_tokens(user_address):
                # Perform the token transfer to user_address on your custom EVM blockchain
                # Add your token transfer logic here

                # Update the last claim time for the user
                user_claims[user_address] = time.time()

                return "Tokens claimed successfully!"
            else:
                return "You can only claim tokens once every 24 hours."
        else:
            return "Invalid tweet. Please make a valid tweet with your wallet address."

    return render_template("index.html")

# Function to validate the tweet
def validate_tweet(user_address, tweet_url):
    try:
        tweet_id = tweet_url.split("/")[-1]
        tweet = twitter_api.get_status(tweet_id)
        if user_address.lower() in tweet.text.lower():
            return True
        else:
            return False
    except tweepy.TweepError as e:
        print(e)
        return False

# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True)
