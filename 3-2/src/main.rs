fn parse_bits(bits: &mut dyn DoubleEndedIterator<Item = usize>) -> usize
{
    bits.rev()
        .enumerate()
        .map(|(i, bit)| if bit == 0 { 0 } else { 2usize.pow(i as u32) })
        .sum()
}

fn main() {
    let grid: Vec<Vec<usize>> = include_str!("../input.txt")
        .lines()
        .map(|line| {
            line.chars()
                .map(|char| match char {
                    '0' => 0,
                    '1' => 1,
                    _ => panic!(),
                })
                .collect::<Vec<usize>>()
        })
        .collect();
        
        let oxygen_generator_rating = {
            let mut remaining: Vec<usize> = (0..grid.len()).collect();

            let mut oxygen_generator_rating: Option<usize> = None;

            for i in 0..grid[0].len() {
                let most_common = match  remaining.iter().map(|j| grid[*j][i]).sum::<usize>() * 2 >= remaining.len() { true => 1, false => 0 };
                remaining = remaining.into_iter().filter(|row| dbg!(grid[*row][i] == most_common)).collect();

                let pretty_remaining = remaining.iter().map(|r| grid[*r].iter().map(|b| b.to_string()).collect::<String>()).collect::<Vec<String>>();

                dbg!(pretty_remaining);
                dbg!(most_common);

                if remaining.len() == 1 {
                    oxygen_generator_rating = Some(parse_bits(&mut grid[remaining[0]].clone().into_iter()));
                    break
                }
            }

            let oxygen_generator_rating = oxygen_generator_rating.unwrap();

            dbg!(oxygen_generator_rating)
        };
        
       let co2_scrubber_rating = {
            let mut remaining: Vec<usize> = (0..grid.len()).collect();

            let mut co2_scrubber_rating: Option<usize> = None;

            for i in 0..grid[0].len() {
                let most_common = match  remaining.iter().map(|j| grid[*j][i]).sum::<usize>() * 2 < remaining.len() { true => 1, false => 0 };
                remaining = remaining.into_iter().filter(|row| grid[*row][i] == most_common).collect();
                if remaining.len() == 1 {
                    co2_scrubber_rating = Some(parse_bits(&mut grid[remaining[0]].clone().into_iter()));
                }
            }

            let co2_scrubber_rating = co2_scrubber_rating.unwrap();

            dbg!(co2_scrubber_rating)
        };

        dbg!(oxygen_generator_rating * co2_scrubber_rating);
}
