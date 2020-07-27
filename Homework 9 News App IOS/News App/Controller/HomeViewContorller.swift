//
//  WeatherScreen.swift
//  News App
//
//  Created by Allen on 4/14/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import CoreLocation
import SwiftSpinner
import Alamofire
import SwiftyJSON
import Toast_Swift

class HomeViewContorller: UIViewController, CLLocationManagerDelegate, UITableViewDelegate, UISearchBarDelegate, UITableViewDataSource, UIContextMenuInteractionDelegate, UISearchControllerDelegate, UISearchResultsUpdating, ToastDelegate
{
    
    
    
    var weatherManager = WeatherManager()
    
    let locationManager = CLLocationManager()
    
    let newsCardManager = NewsCardManager()
    
    var weatherCell: [Weather] = []
    
    var newsCards: [NewsCard] = []
    
    private let refreshControl = UIRefreshControl()
    
    //    var weatherLoaded: Bool = false
    //    var homeNewsLoaded: Bool = false
    
    var myIndex = 0
    //    var resultSearchController = UISearchController()
    var indexPath : IndexPath = []
    
    var searchResults = [String]()
    
    var searchController: UISearchController!
    
    private var searchResultTableController: SearchResultTableViewController!
    
    
    @IBOutlet weak var tableView: UITableView!
    
    
    
    override func viewDidLoad() {
        SwiftSpinner.show("Loading Home Page...")
        super.viewDidLoad()
        
        
        refreshControl.addTarget(self, action: #selector(refreshWeatherData(_:)), for: .valueChanged)
        
        locationManager.delegate = self
        //        locationManager.requestWhenInUseAuthorization()
        locationManager.requestLocation()
        
        tableView.delegate = self
        tableView.dataSource = self
        self.tableView.separatorStyle = UITableViewCell.SeparatorStyle.none
        
        setUpNavBar()
        
        createNewsCardArray()
        
        searchResultTableController =
            self.storyboard?.instantiateViewController(withIdentifier: "SearchResultTableViewController") as? SearchResultTableViewController
        // This view controller is interested in table view row selections.
        searchResultTableController.tableView.delegate = self
        searchController = UISearchController(searchResultsController: searchResultTableController)
        searchController.delegate = self
        searchController.searchResultsUpdater = self
        searchController.searchBar.autocapitalizationType = .none
        searchController.obscuresBackgroundDuringPresentation = false
        searchController.searchBar.delegate = self // Monitor when the search button is tapped.
        searchController.searchBar.placeholder = "Enter keyword.."
        navigationItem.searchController = searchController
        //        navigationItem.hidesSearchBarWhenScrolling = false
        definesPresentationContext = true
        //        setupDataSource()
        
        
    }
    
    //    func setupDataSource() {
    //        searchResults = ["A", "B", "C"]
    //    }
    
    override func viewWillAppear(_ animated: Bool) {
        createNewsCardArray()
        self.tableView.reloadData()
    }
    
    func setAddToast() {
        self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
    }
    
    func setDeleteToast() {
        self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
    }
    
    func updateSearchResults(for searchController: UISearchController) {
        
        if let resultsController = searchController.searchResultsController as? SearchResultTableViewController {
            let inputContent = searchController.searchBar.text!
            print(inputContent)
            resultsController.searchResults = [String]()
            resultsController.tableView.reloadData()
            
            if (inputContent.count >= 3) {
                
                let headers: HTTPHeaders = ["Ocp-Apim-Subscription-Key": "5979a9450d97424281bef53534f9660b"]
                
                AF.request("https://api.cognitive.microsoft.com/bing/v7.0/suggestions?&q=\(inputContent)", headers: headers).validate().responseJSON { response in
                    switch response.result {
                        
                    case .success(let value):
                        let searchJsonObj = JSON(value)
                        //                    debugPrint(searchJsonObj)
                        var result = [String]()
                        print(searchJsonObj["suggestionGroups"][0]["searchSuggestions"].count)
                        for i in 0...searchJsonObj["suggestionGroups"][0]["searchSuggestions"].count - 1 {
                            result.append(searchJsonObj["suggestionGroups"][0]["searchSuggestions"][i]["displayText"].string!)
                        }
                        resultsController.searchResults = result
                        resultsController.tableView.reloadData()
                        self.searchResults = result
                        
                    case .failure(let error):
                        let searchJsonObj = JSON(error)
                        print(searchJsonObj)
                    }
                }
            }
        }
    }
    
    func searchBar(_ searchBar: UISearchBar, selectedScopeButtonIndexDidChange selectedScope: Int) {
        updateSearchResults(for: searchController)
    }
    
    
    
    @objc private func refreshWeatherData(_ sender: Any) {
        createNewsCardArray()
        self.refreshControl.endRefreshing()
    }
    
    
    func createNewsCardArray() {
        var tempNewsCard: [NewsCard] = []
        
        self.newsCardManager.fetchHomeNewsCardData() {value in
            
            for i in 0...(value.count - 1) {
                
                let image: UIImage
                if (value[i]["image"].string == nil) {
                    image = UIImage(named: "default-guardian")!
                }
                else {
                    image = UIImage(data: try! Data(contentsOf: URL(string: value[i]["image"].string!)!))!
                }
                
                let homeNewsCard = NewsCard(
                    image: image,
                    title: value[i]["title"].string!,
                    timeAndSection:
                    "\(value[i]["time"].string!)     |\(value[i]["section"].string!)",
                    articleID: value[i]["id"].string!,
                    imageURL: value[i]["image"].string ?? "none",
                    rawTimeAndSection: "\(value[i]["rawTime"].string!)   |\(value[i]["section"].string!)"
                )
                
                
                tempNewsCard.append(homeNewsCard)
            }
            
            self.newsCards = tempNewsCard
            self.tableView.reloadData()
            SwiftSpinner.hide()
        }
    }
    
    
    
    
    
    
    
    
    
    func setUpNavBar(){
        let searchController = UISearchController(searchResultsController: nil)
        navigationItem.searchController = searchController
        //            navigationItem.searchController!.searchBar.delegate = self as? UISearchBarDelegate
        //            navigationItem.searchController?.searchResultsUpdater = self
        //            navigationItem.searchController?.obscuresBackgroundDuringPresentation = false
        //            searchController.searchResultsUpdater = self
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let location = locations.last {
            print(location)
            
            let geocoder = CLGeocoder()
            
            geocoder.reverseGeocodeLocation(location,completionHandler: { (placemarks, error) in
                if error == nil {
                    let location = placemarks![0]
                    let state = location.administrativeArea!
                    let city = location.subAdministrativeArea!
                    
                    self.weatherManager.fetchWeatherData(city) {value in
                        let weather = WeatherModal(weatherJson: value, city: city, state: state)
                        
                        
                        self.weatherCell = [Weather(
                            image: UIImage(named: weather.summaryImageName)!,
                            city: weather.city,
                            temp: weather.temperatureString,
                            state: weather.state,
                            summary: weather.summary)]
                        
                        self.tableView.reloadData()
                    }
                }
                else {
                    return
                }
            })
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print(error)
    }
    
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return weatherCell.count + newsCards.count
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if #available(iOS 10.0, *) {
            tableView.refreshControl = refreshControl
        } else {
            tableView.addSubview(refreshControl)
        }
        
        
        if indexPath.row == 0{
            if weatherCell.count != 0 {
                let weather = weatherCell[indexPath.row]
                let weatherViewCell = tableView.dequeueReusableCell(withIdentifier: "WeatherCell") as! WeatherCell
                weatherViewCell.setWeather(weather: weather)
                weatherViewCell.selectionStyle = .none
                return weatherViewCell
            }
            return UITableViewCell()
            
            
        } else {
            let homeNewsCard = newsCards[indexPath.row - 1]
            let cell = tableView.dequeueReusableCell(withIdentifier: "NewsCardCell") as! NewsCardCell
            cell.setHomeNewsCard(newsCard: homeNewsCard)
            cell.delegate = self
            cell.setBookmarkButton()
            cell.selectionStyle = .none
            return cell
        }
        
        
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        // Check to see which table view cell was selected.
        if tableView === self.tableView {
            print("Allen1")
            myIndex = indexPath.row
            if (indexPath.row > 0) {
                performSegue(withIdentifier: "showDetailNewsCard", sender: self)
            }
        } else {
            print("Allen2")
            myIndex = indexPath.row
            
            print(myIndex)
            print(searchResults)
            performSegue(withIdentifier: "showSearchResults", sender: self)
        }
        
        //        // Set up the detail view controller to push.
        //        let detailViewController = DetailViewController.detailViewControllerForProduct(selectedProduct)
        //        navigationController?.pushViewController(detailViewController, animated: true)
        //
        //        tableView.deselectRow(at: indexPath, animated: false)
    }
    
    
    
    //
    //    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    //        myIndex = indexPath.row
    //        print(myIndex)
    //        //!!!
    //
    //        if (indexPath.row >= 0) {
    //            performSegue(withIdentifier: "showDetailNewsCard", sender: self)
    //        }
    //
    //
    //
    //
    //
    //    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showDetailNewsCard" {
            let detailArticleViewController = segue.destination as! DetailArticleViewController
            detailArticleViewController.articleID = self.newsCards[myIndex - 1].articleID
        }
            
        else if segue.identifier == "showSearchResults" {
            let searchResultViewController = segue.destination as! SearchResultViewController
            searchResultViewController.searchContent = self.searchResults[myIndex]
            print(self.searchResults[myIndex])
        }
    }
    
    
    func tableView(_ tableView: UITableView, contextMenuConfigurationForRowAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        if tableView === self.tableView {
            return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
                self.myIndex = indexPath.row
                self.indexPath = indexPath
                return self.makeContextMenu(newsCard: self.newsCards[indexPath.row - 1], indexPath: indexPath)
            })
        }
        return nil
    }
    
    
    func contextMenuInteraction(_ interaction: UIContextMenuInteraction, configurationForMenuAtLocation location: CGPoint) -> UIContextMenuConfiguration? {
        if tableView === self.tableView {
            return UIContextMenuConfiguration(identifier: nil, previewProvider: nil, actionProvider: { suggestedActions in
                
                return self.makeContextMenu(newsCard: self.newsCards[self.myIndex], indexPath: self.indexPath)
            })
        }
        return nil
    }
    
    func makeContextMenu(newsCard: NewsCard, indexPath: IndexPath) -> UIMenu {
        var dict = UserDefaults.standard.dictionary(forKey: "bookmark")
        var bookmark: UIAction
        if (dict?.count == 0 || dict![newsCard.articleID] == nil) {
            bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark")) { action in
                
                if(dict == nil) {
                    UserDefaults.standard.set([newsCard.articleID: [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]], forKey: "bookmark")
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else if(dict![newsCard.articleID] == nil) {
                    dict?[newsCard.articleID] = [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else {
                    dict?.removeValue(forKey: newsCard.articleID)
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
                    }
                    
                    self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
                }
            }
        }
            
        else {
            bookmark = UIAction(title: "Bookmark", image: UIImage(systemName: "bookmark.fill")) { action in
                
                if(dict == nil) {
                    UserDefaults.standard.set([newsCard.articleID: [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]], forKey: "bookmark")
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                    
                }
                    
                else if(dict![newsCard.articleID] == nil) {
                    dict?[newsCard.articleID] = [newsCard.title, newsCard.imageURL, newsCard.rawTimeAndSection]
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark.fill"), for: .normal)
                    }
                    self.view.makeToast("Article Bookmarked. Check out the bookmarks tab to view.", duration: 2.0, position: .bottom)
                }
                    
                else {
                    dict?.removeValue(forKey: newsCard.articleID)
                    UserDefaults.standard.set(dict, forKey: "bookmark")
                    
                    if let cell = self.tableView.cellForRow(at: indexPath) as? NewsCardCell {
                        cell.newCardButton.setImage(UIImage(systemName: "bookmark"), for: .normal)
                    }
                    
                    self.view.makeToast("Article Removed from Bookmarks.", duration: 2.0, position: .bottom)
                    
                }
            }
        }
        
        let share = UIAction(title: "Share with Twitter", image: UIImage(named: "twitter")) { action in
            let shareContent = "https://www.theguardian.com/\(newsCard.articleID)"
            UIApplication.shared.open(URL(string: "https://twitter.com/intent/tweet?url=\(shareContent)&hashtags=CSCI_571_NewsApp")!)
        }
        
        return UIMenu(title: "Memu", children: [share, bookmark])
    }
    
    
}

