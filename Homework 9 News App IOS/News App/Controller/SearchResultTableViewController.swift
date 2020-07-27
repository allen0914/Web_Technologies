//
//  SearchResultTableViewController.swift
//  News App
//
//  Created by Allen on 4/22/20.
//  Copyright © 2020 Allen. All rights reserved.
//

import UIKit

class SearchResultTableViewController: UITableViewController {
    
    var searchResults = [String]()
    
    @IBOutlet var searchTableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //        searchTableView.delegate = self
        //        searchTableView.dataSource = self
        
    }
    
    // MARK: - Table view data source
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return searchResults.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let searchResult = searchResults[indexPath.row]
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "ResultCell") as! ResultCell
        cell.setSearchResult(searchResult: searchResult)
        return cell
    }
    
    
    //    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    //        myIndex = indexPath.row
    //        print(myIndex)
    //        //!!!
    //        if (indexPath.row >= 0) {
    //            performSegue(withIdentifier: "showSearchResult", sender: self)
    //        }
    
}



