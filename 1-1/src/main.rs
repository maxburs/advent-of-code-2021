use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}

// 1602

fn main() {
    let mut keys = read_lines("./input.txt")
        .unwrap()
        .map(|line| line.unwrap().parse::<i32>().unwrap());

    let mut last = keys.next().unwrap();
    let mut total = 0;

    println!("{}", last);
    for item in keys {
        if item > last {
            total += 1;
        }
        println!(
            "{} {} {}",
            item,
            if item > last {
                "increased"
            } else {
                "decreased"
            },
            total
        );
        last = item;
    }

    dbg!(total);
}
