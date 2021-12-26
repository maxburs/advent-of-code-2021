fn parse_bits(bits: &mut dyn DoubleEndedIterator<Item = bool>) -> u32
{
    bits.rev()
        .enumerate()
        .map(|(i, bit)| if bit { 0 } else { 2u32.pow(i as u32) })
        .sum()
}

// 4160394

fn main() {
    let input: Vec<Vec<bool>> = include_str!("../input.txt")
        .lines()
        .map(|line| {
            line.chars()
                .map(|char| match char {
                    '0' => false,
                    '1' => true,
                    _ => panic!(),
                })
                .collect::<Vec<bool>>()
        })
        .collect();

    let bits = (0..input[0].len())
        .map(|i| input.iter().filter(|row| row[i]).count() * 2 > input.len())
        .collect::<Vec<bool>>();

    println!(
        "{}",
        bits.iter()
            .map(|bit| match bit {
                true => '1',
                false => '0',
            })
            .collect::<String>()
    );

    let gamma_rate = parse_bits(&mut bits.clone().into_iter());
    let epsilon_rate = parse_bits(&mut bits.iter().map(|bit| !bit));

    dbg!(gamma_rate, epsilon_rate, gamma_rate * epsilon_rate);
}
