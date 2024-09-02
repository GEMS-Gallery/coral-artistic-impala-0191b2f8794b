import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor {
  // Define the TaxPayer type
  public type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  // Stable variable to store TaxPayer records
  private stable var taxPayersEntries : [(Text, TaxPayer)] = [];

  // Mutable HashMap for efficient in-memory operations
  private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  // Initialize the taxPayers HashMap with stable data
  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayersEntries.vals(), 0, Text.equal, Text.hash);
    taxPayersEntries := [];
  };

  // Create a new TaxPayer record
  public func createTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async Bool {
    let newTaxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };

    let existingTaxPayer = taxPayers.get(tid);
    switch (existingTaxPayer) {
      case (null) {
        taxPayers.put(tid, newTaxPayer);
        true
      };
      case (?_) {
        false // TaxPayer with this TID already exists
      };
    }
  };

  // Get all TaxPayer records
  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  // Search for a TaxPayer by TID
  public query func searchTaxPayerByTID(tid: Text) : async ?TaxPayer {
    taxPayers.get(tid)
  };
}
