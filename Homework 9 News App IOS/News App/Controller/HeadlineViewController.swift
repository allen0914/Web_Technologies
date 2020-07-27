//
//  HeadlineViewController.swift
//  News App
//
//  Created by Allen on 4/17/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit
import XLPagerTabStrip
import UIKit
import CoreLocation
import SwiftSpinner
import Alamofire
import SwiftyJSON

class HeadlineViewController: ButtonBarPagerTabStripViewController, UISearchControllerDelegate, UISearchResultsUpdating, UISearchBarDelegate, UITableViewDelegate {
    
    
    
    
    
    var searchResults = [String]()
    
    var searchController: UISearchController!
    
    private var searchResultTableController: SearchResultTableViewController!
    
    var myIndex = 0
    
    
    
    override func viewDidLoad() {
        self.loadDesign()
        
        super.viewDidLoad()
        
        setUpNavBar()
        
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
    
    func updateSearchResults(for searchController: UISearchController) {
        
        if let resultsController = searchController.searchResultsController as? SearchResultTableViewController {
            let inputContent = searchController.searchBar.text!
            print(inputContent)
            
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
    
    func setUpNavBar(){
        let searchController = UISearchController(searchResultsController: nil)
        navigationItem.searchController = searchController
        //            navigationItem.searchController!.searchBar.delegate = self as? UISearchBarDelegate
        //            navigationItem.searchController?.searchResultsUpdater = self
        //            navigationItem.searchController?.obscuresBackgroundDuringPresentation = false
        //            searchController.searchResultsUpdater = self
    }
    
    
    
    
    override func viewControllers(for pagerTabStripController: PagerTabStripViewController) -> [UIViewController] {
        let child_1 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "WorldSectionTable")
        let child_2 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "BusinessSectionTable")
        let child_3 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "PoliticsSectionTable")
        let child_4 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "SportsSectionTable")
        let child_5 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "TechnologySectionTable")
        let child_6 = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "ScienceSectionTable")
        return [child_1, child_2, child_3, child_4, child_5, child_6]
        
    }
    
    func loadDesign() {
        print("loaded")
        //        self.settings.style.selectedBarHeight = 15
        self.settings.style.selectedBarBackgroundColor = .blue
        self.settings.style.buttonBarBackgroundColor = .white
        self.settings.style.buttonBarItemBackgroundColor = .white
        self.settings.style.buttonBarItemFont = .boldSystemFont(ofSize: 18)
        //        self.settings.style.selectedBarHeight = 5
        //        self.settings.style.buttonBarMinimumLineSpacing = 30
        //        self.settings.style.buttonBarItemTitleColor = .blue
        //        self.settings.style.buttonBarItemsShouldFillAvailableWidth = true
        //        self.settings.style.buttonBarLeftContentInset = 10
        //        self.settings.style.buttonBarRightContentInset = 10
        
        changeCurrentIndexProgressive = { (oldCell: ButtonBarViewCell?, newCell: ButtonBarViewCell?, progressPercentage: CGFloat, changeCurrentIndex: Bool, animated: Bool) -> Void in
            guard changeCurrentIndex == true else {return}
            oldCell?.label.textColor = UIColor.gray
            newCell?.label.textColor = UIColor.blue
        }
        
        
        
    }
    
    
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        myIndex = indexPath.row
        print("Allen1")
        print(myIndex)
        print(searchResults)
        performSegue(withIdentifier: "showSearchResults", sender: self)
    }
    
    
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier == "showSearchResults" {
            print("Allen2")
            let searchResultViewController = segue.destination as! SearchResultViewController
            searchResultViewController.searchContent = self.searchResults[myIndex]
            print(self.searchResults[myIndex])
        }
    }
    
}
