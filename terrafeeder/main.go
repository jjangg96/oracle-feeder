// Copyright © 2019 Terra <team@terra.money>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"feeder/cmds"
	"fmt"
	"github.com/spf13/cobra"
	"github.com/syndtr/goleveldb/leveldb"
	"os"
)

func main() {

	// rootCmd represents the base command when called without any subcommands
	var rootCmd = &cobra.Command{
		Use:   "terrafeeder",
		Short: "Terra oracle terrafeeder client daemon",
		Long:  `Terra oracle terrafeeder client daemon. Long description`,
	}

	cmds.InitConfig(rootCmd)
	db, err := leveldb.OpenFile(cmds.GetHistoryPath(), nil)
	if err != nil {
		panic(err)
	}

	defer func() {
		_ = db.Close()
	}()

	rootCmd.AddCommand(cmds.StartCommands(db), cmds.ConfigCommands())

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}