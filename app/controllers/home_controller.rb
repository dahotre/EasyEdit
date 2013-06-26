require 'open-uri'

class HomeController < ApplicationController
  @@BING_URL = 'http://api.bing.com/osjson.aspx?query='

  def index

    respond_to do |format|
      format.html
      format.json {

        allText = params[:allText]
        word = allText.split(/\W+/).last unless allText.blank?
        phrase = allText.split(/\W+/).last(3).join(' ') unless allText.blank?
        line = allText.split('.').last unless allText.blank? or !allText.split('.').present?

        letter = allText.last

        lineTextOptions = JSON.parse(URI.parse(@@BING_URL + "#{URI::encode(line)}").read)[1].first 2 unless line.blank?
        phraseOptions = JSON.parse(URI.parse(@@BING_URL + "#{URI::encode(phrase)}").read)[1].first 5 unless phrase.blank?
        wordOptions = JSON.parse(URI.parse(@@BING_URL + "#{URI::encode(word)}").read)[1].first 5 unless word.blank?
        #letterOptions = JSON.parse(URI.parse(@@BING_URL + "#{URI::encode(letter)}").read)[1].first 2

        @options = {"#{word}" => word, "#{line}" => lineTextOptions, "#{phrase}" => phraseOptions, "#{word}" => wordOptions}
        render json: @options
      }
    end
  end
end
