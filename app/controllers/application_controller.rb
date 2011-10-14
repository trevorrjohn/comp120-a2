class ApplicationController < ActionController::Base
  require 'net/http'
  require 'rubygems'
  require 'json'
  protect_from_forgery
end
