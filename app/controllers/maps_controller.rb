class MapsController < ApplicationController
  require 'net/https'
  require 'uri'
  require 'json'

  def find_nearest_restaurants
      url = "https://maps.googleapis.com/maps/api/place/search/json?location=#{ params[:lat] },#{ params[:lng] }&radius=3219&types=food%7Cconvenience_store%7Cgrocery_or_supermarket%7Cliquor_store&sensor=true&key=AIzaSyA4Edo3tYUN_XVV4z4nrB9P_o8v-5X-4oI"
      puts url
      uri = URI.parse(url)

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      request = Net::HTTP::Get.new(uri.request_uri)
      response = http.request(request)

      render :json => response.body
  end

  def get_restaurant_details
    url = "https://maps.googleapis.com/maps/api/place/details/json?reference=#{ params[:id] }&sensor=true&key=AIzaSyA4Edo3tYUN_XVV4z4nrB9P_o8v-5X-4oI"
    uri = URI.parse(url)

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new(uri.request_uri)
    response = http.request(request)

    render :json => response.body
  end
end
