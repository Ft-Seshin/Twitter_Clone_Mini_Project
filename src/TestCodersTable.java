package tech.codingclub.database;

import tech.codingclub.entity.Coders;

public class TestCodersTable {

    public static void main(String[] args) {

        Coders aditya_mundada = new Coders("Aditya Mundada", 21L );
        //Insert this object into DB !
//       < ENTITY CLASS>
        new GenericDB<Coders>().addRow(tech.codingclub.tables.Coders.CODERS, aditya_mundada);
         //curd operation
    }
}
