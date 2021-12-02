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

fn main() {
    let keys = read_lines("./input.txt")
        .unwrap()
        .map(|line| line.unwrap().parse::<i32>().unwrap());
        
    let win1 = keys.collect::<Vec<i32>>();
    let win3 = win1.windows(3).map(|item| item.iter().sum::<i32>()).collect::<Vec<i32>>();
    let win2 = win3.windows(2);
    let mut total = 0;

    for i in win2 {
        if i[1] > i[0] {
            total += 1;
        }
    }

    dbg!(total);
}
